package src

import (
	"encoding/json"
	"io/ioutil"
	"os"
)

// Quote took from https://www.kaggle.com/akmittal/quotes-dataset
type Quote struct {
	Quote      string   `json:"Quote"`
	Author     string   `json:"Author"`
	Tags       []string `json:"Tags"`
	Popularity float64  `json:"Popularity"`
	Category   string   `json:"Category"`
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
