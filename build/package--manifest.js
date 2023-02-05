import * as fs from "fs";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));

const manifestJson = {
	"id": packageJson.name,
	"title": "More SFX Triggers for Dice So Nice",
	"description": `Adds more "Special Effects" triggers to Dice So Nice!`,
	"version": packageJson.version,
	"authors": [
		{
			"name": "cirrahn",
			"url": "https://www.patreon.com/cirrahn",
			"discord": "Murray#3081",
			"flags": {
				"patreon": "cirrahn",
				"github": "cirrahn"
			}
		}
	],
	"keywords": [
		"dice"
	],
	"languages": [
		{
			"lang": "en",
			"name": "English",
			"path": "lang/en.json"
		}
	],
	"readme": "README.md",
	"license": "MIT",
	"manifest": `https://github.com/cirrahn/foundry-dice-so-nice-more-sfx-triggers/releases/latest/download/module.json`,
	"download": `https://github.com/cirrahn/foundry-dice-so-nice-more-sfx-triggers/releases/download/v${packageJson.version}/dice-so-nice-more-sfx-triggers.zip`,
	"changelog": "https://raw.githubusercontent.com/cirrahn/foundry-dice-so-nice-more-sfx-triggers/main/CHANGELOG.md",

	"compatibility": {
		"minimum": "10",
		"verified": "10.291"
	},
	"esmodules": [
		"js/Main.js"
	],
	"relationships": {
		"requires": [
			{
				"id": "dice-so-nice",
				"type": "module",
			},
			{
				"id": "lib-wrapper",
				"type": "module",
			},
			{
				"id": "dnd5e",
				"type": "system",
			}
		]
	},
}


fs.writeFileSync(`dist/${packageJson.name}/module.json`, JSON.stringify(manifestJson, null, "\t"), "utf-8");
