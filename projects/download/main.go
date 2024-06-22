package main

import (
	"crypto/sha1"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"flag"
	"fmt"
	hash2 "hash"
	"io"
	"log"
	"net/http"
	url2 "net/url"
	"os"
	"path"
)

type HashType string

const (
	HashTypeSha256 HashType = "sha256"
	HashTypeSha1   HashType = "sha1"
)

func main() {
	// Get arguments
	var url string
	flag.StringVar(&url, "url", "", "Url of the file to download")
	var hashTypeStr string
	flag.StringVar(&hashTypeStr, "hash-type", "sha1", "Hash type (allowed: sha1, sha256)")
	var expectedHash string
	flag.StringVar(&expectedHash, "hash", "", "Hash of the file")
	var target string
	flag.StringVar(&target, "target", "", "Output path where the file will be downloaded")
	flag.Parse()

	if len(url) == 0 {
		log.Fatal(errors.New("an valid url need to be passed with --url"))
	}
	if _, err := url2.Parse(url); err != nil {
		log.Fatal(err)
	}

	// Validate expectedHash
	var hashType HashType
	switch hashTypeStr {
	case "sha256":
		hashType = HashTypeSha256
	case "sha1":
		hashType = HashTypeSha1
	default:
		log.Fatal(errors.New("invalid expectedHash type (allowed: sha256, sha1)"))
	}

	if len(expectedHash) == 0 {
		log.Fatal(errors.New("a valid hash need to be passed with --hash"))
	}
	if len(target) == 0 {
		log.Fatal(errors.New("a valid target path need to be passed with --target"))
	}

	size, err := downloadFile(url, target)
	if err != nil {
		log.Fatal(err)
	}

	actualHash, err := computeHash(target, hashType)
	if err != nil {
		log.Fatal(err)
	}
	if actualHash != expectedHash {
		log.Fatal(fmt.Errorf("invalid file expectedHash. Expected \"%s\", got \"%s\"", expectedHash, actualHash))
	}

	log.Printf("Successfully downloaded file \"%s\" (%d bytes) to \"%s\".\n", url, size, target)
}

func downloadFile(url string, target string) (int64, error) {
	dirname := path.Dir(target)
	err := os.MkdirAll(dirname, os.ModePerm)
	if err != nil {
		return -1, err
	}

	// Create the file
	file, err := os.Create(target)
	if err != nil {
		return -1, err
	}

	// Download the file
	resp, err := http.Get(url)
	if err != nil {
		return -1, err
	}
	defer resp.Body.Close()

	// Copy the response to the file
	size, err := io.Copy(file, resp.Body)
	if err != nil {
		return -1, err
	}
	defer file.Close()

	return size, nil
}

func computeHash(path string, hashType HashType) (string, error) {
	file, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer file.Close()

	var hasher hash2.Hash
	switch hashType {
	case HashTypeSha256:
		hasher = sha256.New()
	case HashTypeSha1:
		hasher = sha1.New()
	}

	// Check the file expectedHash (sha256, sha1)
	_, err = io.Copy(hasher, file)
	if err != nil {
		log.Fatal(err)
	}

	var h = hasher.Sum(nil)

	log.Printf("File hash is %x", h)
	var fileHash = hex.EncodeToString(h)
	return fileHash, nil
}
