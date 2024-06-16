package config

import "fmt"

type InvalidCidrError struct {
	Value   string
	Message error
}

func (e *InvalidCidrError) Error() string {
	return fmt.Sprintf("Invalid subnet `%s` specified", e.Value)
}
