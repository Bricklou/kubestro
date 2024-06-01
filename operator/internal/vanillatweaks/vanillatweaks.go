package vanillatweaks

import (
	"context"
	minecraftv1alpha1 "github.com/bricklou/kubestro/api/manager/v1"
	"github.com/bricklou/kubestro/internal/version"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"io"
	"k8s.io/apimachinery/pkg/util/json"
	"net/http"
	"net/url"
	"sigs.k8s.io/controller-runtime/pkg/log"
)

func GetDatapackDownloadURL(ctx context.Context, v string, datapacks []minecraftv1alpha1.VanillaTweaksDatapack) (string, error) {
	logger := log.FromContext(ctx)

	selected := make(map[string][]string)
	for _, d := range datapacks {
		selected[d.Category] = append(selected[d.Category], d.Name)
	}
	selectedEncoded, err := json.Marshal(selected)
	if err != nil {
		return "", err
	}

	form := url.Values{}
	form.Add("version", version.ParseMinorVersion(v))
	form.Add("packs", string(selectedEncoded))

	resp, err := http.PostForm("https://vanillatweaks.net/assets/server/zipdatapacks.php", form)
	if err != nil {
		return "", err
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	logger.WithValues(
		zap.String("request", form.Encode()),
		zap.String("response", string(data))).V(4).Info("Made request to Vanilla Tweaks API")

	var parsed map[string]interface{}
	err = json.Unmarshal(data, &parsed)
	if err != nil {
		return "", err
	}

	status, ok := parsed["status"]
	if !ok {
		return "", errors.New("Response from VanillaTweaks did not have status key")
	}
	statusString, ok := status.(string)
	if !ok {
		return "", errors.New("status key in VanillaTweaks response was not a string")
	}
	if statusString != "success" {
		return "", errors.New("status from VanillaTweaks was not 'success'")
	}

	link, ok := parsed["link"]
	if !ok {
		return "", errors.New("Response from VanillaTweaks did not have link key")
	}
	linkString, ok := link.(string)
	if !ok {
		return "", errors.New("link key in VanillaTweaks response was not a string")
	}

	return "https://vanillatweaks.net" + linkString, nil
}
