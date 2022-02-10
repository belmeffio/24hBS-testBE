# 24hBS-testBE
Test for coding BE

## The code
Technology used: NodeJS, for simple API building.
Main module: Express, mainly to help routing

## The data
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
This could have been done better using "json-server" module.

## The routes
Routes are set separately from the server in the /routes folder

## How to install
This is a very simple Node API, just:

>git clone
>npm install
>npm run start 
>(for development use npm run dev)

## Testing
To help testing it's included a JSON of a collection of calls, to import in Postman

### Comments
To explain the developing choices please refere to the comments in the code.

# The End
Thanks