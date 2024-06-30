package http

import (
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

func setupBindings(router *Router) error {
	// Custom validators
	_, ok := binding.Validator.Engine().(*validator.Validate)
	if ok {
		// TODO: Add custom validators here
		return nil
	}

	return nil
}
