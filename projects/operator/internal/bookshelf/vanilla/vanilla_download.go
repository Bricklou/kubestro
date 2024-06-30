package vanilla

import (
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/pkg/errors"
	"k8s.io/apimachinery/pkg/util/json"
)

type VersionsManifestLatest struct {
	Release  string `json:"release"`
	Snapshot string `json:"snapshot"`
}
type VersionType string

const (
	VersionTypeRelease  VersionType = "release"
	versionTypeSnapshot VersionType = "snapshot"
)

type VersionsManifestSingleVersion struct {
	Id          string      `json:"id"`
	Type        VersionType `json:"type"`
	Url         string      `json:"url"`
	Time        time.Time   `json:"time"`
	ReleaseTime time.Time   `json:"releaseTime"`
	Sha1        string      `json:"sha1"`
}

type VersionsManifest struct {
	Latest   VersionsManifestLatest          `json:"latest"`
	Versions []VersionsManifestSingleVersion `json:"versions"`
}

type SingleVersionDownloadsItem struct {
	Sha1 string `json:"sha1"`
	Size uint64 `json:"size"`
	Url  string `json:"url"`
}
type SingleVersionDownloads struct {
	Server SingleVersionDownloadsItem `json:"server"`
}

type SingleVersionJavaVersion struct {
	Component    string `json:"component"`
	MajorVersion int    `json:"majorVersion"`
}

type SingleVersionManifest struct {
	JavaVersion SingleVersionJavaVersion `json:"javaVersion"`
	Downloads   SingleVersionDownloads   `json:"downloads"`
}

func GetVersionManifest(version string) (SingleVersionManifest, error) {
	const pistonDataJsonUrl = "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json"

	// Download and parse the Piston manifest
	body, err := downloadJson(pistonDataJsonUrl)
	if err != nil {
		return SingleVersionManifest{}, err
	}

	var manifestJson VersionsManifest
	err = json.Unmarshal(body, &manifestJson)
	if err != nil {
		return SingleVersionManifest{}, err
	}

	// Get the versions list
	var versions = manifestJson.Versions
	// Search for the needed version
	var foundVersion *VersionsManifestSingleVersion = nil

	if version == "latest" {
		version = manifestJson.Latest.Release
	} else if version == "snapshot" {
		version = manifestJson.Latest.Snapshot
	}

	for i := range versions {
		ver := versions[i]
		if ver.Id == version {
			foundVersion = &ver
			break
		}
	}

	if foundVersion == nil {
		return SingleVersionManifest{}, errors.New(fmt.Sprintf("Minecraft version \"%s\" not found", version))
	}

	// Download and parse version manifest
	body, err = downloadJson(foundVersion.Url)
	if err != nil {
		return SingleVersionManifest{}, err
	}

	var versionManifest SingleVersionManifest
	err = json.Unmarshal(body, &versionManifest)
	if err != nil {
		return SingleVersionManifest{}, err
	}

	return versionManifest, nil
}

func GetDownloadURLAndSHA1(versionManifest SingleVersionManifest) (string, string, error) {
	var serverData = versionManifest.Downloads.Server

	return serverData.Url, serverData.Sha1, nil
}

func downloadJson(url string) ([]byte, error) {
	r, err := http.Get(url)
	if err != nil {
		return nil, err
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}
