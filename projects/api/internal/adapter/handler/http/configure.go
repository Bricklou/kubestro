package http

func ConfigureRouter(router *Router) error {
	err := setupBindings(router)
	if err != nil {
		return err
	}

	setupSwagger(router)

	return nil
}
