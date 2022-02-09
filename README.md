# 24hBS-testBE
Test for coding BE

Technology used: NodeJS, for simple API building.
Main module: Express, mainly to help routing

The data consist in a JSON file "jokes.json" contained in "data" folder. 
It's an array of elements of the given format:
{
"id" : STRING, ID unique for each JOKE
"icon_url" : STRING, URL of a valid web compatible image
"url" : STRING, URL of the JOKE, if not provided the default value is [BASE_DOMAIN]/view/joke/[ID]
"value" : STRING, the text of the JOKE
"created_at": DATETIME, the creation date time
"updated_at": DATETIME, the last updated date time
"categories": STRING[], the list of categories for the JOKE
}

Routes are set separately from the server in the /routes folder

This is a very simple Node API, just:

git clone
npm install
npm start (for development use npm dev)

To help testing it's included a JSON of a collection of calls, to import in Postman


To explain the developing choices please refere to the comments in the code.

Thanks