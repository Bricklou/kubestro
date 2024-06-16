package config

import "fmt"

type InvalidIpError struct {
	Value   string
	Message error
}

func (e *InvalidIpError) Error() string {
	return fmt.Sprintf("Invalid ip or subnet `%s` specified", e.Value)
}
