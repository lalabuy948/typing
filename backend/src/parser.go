package src

import (
	"encoding/json"
	"io/ioutil"
	"os"
)

// Quote took from https://www.kaggle.com/akmittal/quotes-dataset
type Quote struct {
	Author string   `json:"Author"`
	Quote  string   `json:"Quote"`
	Tags   []string `json:"Tags"`
}

func ParseJsonQuotes() ([]Quote, error) {
	jsonFile, err := os.Open("quotes.json")
	if err != nil {
		return nil, err
	}

	byteValue, _ := ioutil.ReadAll(jsonFile)

	var quotes []Quote
	err = json.Unmarshal(byteValue, &quotes)
	if err != nil {
		return nil, err
	}

	return quotes, nil
}
