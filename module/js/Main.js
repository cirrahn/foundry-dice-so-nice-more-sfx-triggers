class Consts {
	static MODULE_ID = "dice-so-nice-more-sfx-triggers";
}

class Idents {
	static ALL_IDENTS = new Set();

	static _addIdent (ident) {
		this.ALL_IDENTS.add(ident);
		return ident;
	}

	static getSkillIdent (skl) { return this._addIdent(`dnd5e-skill-${skl}`); }
	static getSaveIdent (skl) { return this._addIdent(`dnd5e-save-${skl}`); }
	static getAbilityTestIdent (skl) { return this._addIdent(`dnd5e-ability-test-${skl}`); }
}

class Patches {
	static FN_PATCH_SPAWN_DICE = (fn, ...args) => {
		const [dicedata] = args;

		// If there is 1 or 0 SFX, bail out
		if ((dicedata?.specialEffects?.length || 0) <= 1) return fn(...args);

		// If none of the SFX belong to us, bail out
		if (!dicedata.specialEffects.some(sfx => Idents.ALL_IDENTS.has(sfx?.diceType))) return fn(...args);

		// Filter down to SFX belonging to us
		dicedata.specialEffects = dicedata.specialEffects.filter(sfx => Idents.ALL_IDENTS.has(sfx?.diceType));

		return fn(...args);
	};

	static onConfigChange_isSquashNonSpecificSfx (value) {
		if (value === undefined) value = game.settings.get(Consts.MODULE_ID, "isSquashNonSpecificSfx");

		if (value) window.libWrapper.register(Consts.MODULE_ID, "game.dice3d.box.spawnDice", Patches.FN_PATCH_SPAWN_DICE, "WRAPPER");
		else window.libWrapper.unregister(Consts.MODULE_ID, "game.dice3d.box.spawnDice", false);
	}
}

Hooks.on("init", () => {
	game.settings.register(
		Consts.MODULE_ID,
		"isSquashNonSpecificSfx",
		{
			name: "DSNMSFXT.Squash Clashing SFX",
			hint: "DSNMSFXT.When dnd5e-specific SFX is triggered for a roll (e.g., when rolling a skill), and non-dnd5e-specific SFX is triggered (e.g., when rolling a d20 value), squash the latter SFX if both would trigger for the same roll.",
			default: false,
			type: Boolean,
			scope: "world",
			config: true,
			restricted: true,
			onChange: value => {
				Patches.onConfigChange_isSquashNonSpecificSfx(value);
			},
		},
	);
});

Hooks.once("diceSoNiceReady", (dice3d) => {
	Patches.onConfigChange_isSquashNonSpecificSfx();

	const d20Results = [...new Array(20)].map((_, i) => `${i + 1}`);

	Object.entries(CONFIG.DND5E.skills)
		.forEach(([skl, info]) => {
			dice3d.addSFXTrigger(Idents.getSkillIdent(skl), `Skill: ${info.label}`, foundry.utils.deepClone(d20Results));
		});

	Object.entries(CONFIG.DND5E.abilities)
		.forEach(([abil, label]) => dice3d.addSFXTrigger(Idents.getSaveIdent(abil), `Save: ${label}`, foundry.utils.deepClone(d20Results)));

	Object.entries(CONFIG.DND5E.abilities)
		.forEach(([abil, label]) => dice3d.addSFXTrigger(Idents.getAbilityTestIdent(abil), `Ability Test: ${label}`, foundry.utils.deepClone(d20Results)));
});

Hooks.on("dnd5e.rollSkill", (actor, roll, skill) => {
	roll.dice[0].options.sfx = {
		id: Idents.getSkillIdent(skill),
		result: roll.dice[0].total,
	};
});

Hooks.on("dnd5e.rollAbilitySave", (actor, roll, abil) => {
	roll.dice[0].options.sfx = {
		id: Idents.getSaveIdent(abil),
		result: roll.dice[0].total,
	};
});

Hooks.on("dnd5e.rollAbilityTest", (actor, roll, abil) => {
	roll.dice[0].options.sfx = {
		id: Idents.getAbilityTestIdent(abil),
		result: roll.dice[0].total,
	};
});
