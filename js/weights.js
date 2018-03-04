function adjustWeights() {
	gtag('event', 'Dark Mode', {
		'event_category': 'Dark Mode',
		'event_action': 'Setting',
		'event_label': ($('#dark').prop('checked') ? 'Dark' : 'Light' )
	});
	if($('#build').val()) {
		gtag('event', 'Build', {
			'event_category': 'Build',
			'event_action': 'Value',
			'event_label': $('#build').val()
		});
	}
	if($('#hero').val()) {
		gtag('event', 'Hero', {
			'event_category': 'Hero',
			'event_action': 'Set',
			'event_label': $('#hero').val()
		});
	}
	if($('#gold').val()) {
		gtag('event', 'Gold', {
			'event_category': 'Gold',
			'event_action': 'Set',
			'event_label': $('#gold').val()
		});
	}
	if($('#active').val()) {
		gtag('event', 'Active', {
			'event_category': 'Active',
			'event_action': 'Set',
			'event_label': $('#active').val()
		});
	}
	var build = $('#build').val();
	var hero_type = '';
	var active = ("online" == $('#active').val() ? true : false);
	var gold = $('#gold').val();

	switch($('#hero').val()) {
		case 'maya':
		case 'kronus':
		case 'kiki':
		case 'beany':
		case 'ursa':
		case 'wally':
		case 'pharaoh':
		case 'cass':
		case 'lucy':
		case 'jazz':
		case 'mina':
			hero_type = 'spell_ground';
			break;

		case 'zato':
		case 'sophia':
		case 'lance':
		case 'gulbrand':
		case 'rhys':
		case 'cosette':
		case 'jayce':
		case 'boomoh':
		case 'aya':
		case 'yzafa':
		case 'finn':
			hero_type = 'melee_ground';
			break;

		case 'pingo':
		case 'rosabella':
		case 'davey':
		case 'maddie':
		case 'sawyer':
		case 'saje':
		case 'dex':
		case 'lala':
		case 'miki':
			hero_type = 'ranged_ground';
			break;

		case 'maple':
		case 'nohni':
			hero_type = 'melee_flying';
		break;

		case 'kin':
		case 'zolom':
			hero_type = 'ranged_flying';
			break;

		case 'titania':
		case 'damon':
			hero_type = 'spell_flying';
			break;
	}
	$.each(artifacts.data, function(k,v) {
		v.rating = 0;
		if('bos' == k) {
			v.color = 'info';
		} else if(undefined != v.expo.sum) {
			switch(v.expo.sum) {
				case 'pet_dmg':
					v.rating += pets_dmg.all;
					v.rating += pets_dmg.tap * reducts.tap[build];
					v.rating += pets_dmg.hero * reducts.hero[build];
					v.rating += pets_dmg.splash * reducts.splash[build];
					v.color = 'info';
					break;

				case 'pet_gold':
					v.rating += pets_gold * reducts.gold;
					v.color = 'warning';
					break;

				case 'skill':
					v.rating += reducts.hs[build];
					v.rating += reducts.ds[build];
					v.rating += reducts.gold;
					v.rating += reducts.fs[build];
					v.rating += reducts.wc[build];
					v.rating += reducts.sc[build];
					v.color = 'info';
					break;

				case 'equip':
					v.rating += 1;
					v.rating += reducts.hero[build];
					v.rating += reducts.gold;
					v.rating += reducts.companion[build];
					v.color = 'info';
					break;
			}
		} else if(undefined != v.expo.flat) {
			switch(v.expo.flat) {
				case 'gold':
					v.rating = reducts.gold;
					v.color = 'warning';
					break;

				case 'dmg':
					v.rating = 1;
					v.color = 'info';
					break;

				case 'hsk':
					if(1 == artifacts.data.hs2.active) {
						v.rating = 1;
						v.color = 'info';
					} else {
						v.rating = 0.5;
						v.color = 'secondary';
					}
					break;

				case 'active':
					if(1 == active) {
						v.rating = 1;
						v.color = 'info';
					} else {
						v.rating = 0;
						v.color = 'danger';
					}
					break;

				case 'inactive':
				if(0 == active) {
					v.rating = 1;
					v.color = 'success';
				} else {
					v.rating = 0;
					v.color = 'danger';
				}
			}
		} else if(undefined != v.expo.reduct) {
			if('splash' == v.expo.reduct && $('#dry').prop('checked') == true) {
				v.rating = 0;
			} else {
				v.rating = reducts[v.expo.reduct][build];
			}
			v.color = determineColor(v.rating);
		} else if(undefined != v.expo.hero_type) {
			if(-1 == hero_type.indexOf(v.expo.hero_type)) {
				v.rating = 0;
			} else {
				v.rating = reducts.hero[build];
			}
			v.color = determineColor(v.rating);
		} else if(undefined != v.expo.gold) {
			$.each(v.expo.gold, function(k2,v2) {
				if(gold == v2) {
					v.rating = reducts.gold;
					return false;
				} else if('splash' == v2) {
					if('sc' == build) {
						v.rating = 0;
					} else {
						v.rating = reducts.splash[build] * reducts.gold;
						return false;
					}
				} else if('inactive' == v2) {
					if(!active) {
						v.rating = reducts.gold;
					}
					return false;
				} else if('active' == v2) {
					if(active) {
						v.rating = reducts.gold;
					}
					return false;
				}
			});
			v.color = determineColor(v.rating);
		}
	});
	adjustBoS();
	artifacts = calculateAll(artifacts, true);
}

function determineColor(value) {
	if(reducts.gold == value) {
		return 'warning';
	} else if(1 == value) {
		return 'success';
	} else if(0 == value) {
		return 'danger';
	} else {
		return 'secondary';
	}
}
