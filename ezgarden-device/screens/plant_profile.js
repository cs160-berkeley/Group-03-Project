import * as assets from '../assets';
import * as screenUtils from '../screen_utils';
import * as main from '../main';

let whiteSkin = new Skin({ fill: 'white' });
let blueSkin = new Skin({ fill: '#B8E5F4' });
let popupSkin = new Skin({ fill: "white", stroke: "#757575", borders: { left: 1, top: 1, right: 1, bottom: 1 }});

let blackText = new Style({ font: "16px segoe script", color: "black" });
let boldText = new Style({ font: "bold 18px segoe script", color: "black" });
let greenPopupText = new Style({ font: "18px arial", color: "#6FCF97" });
let grayText = new Style({ font: "18px arial", color: "#757575" });

var StringTemplate = Text.template($ => ({
    left: 3, right: 3, top: 3, bottom: 0,
    style: $.style,
    string: $.string
}));

var TextButton = Container.template($ => ({
    left: 0, right: 0, bottom: 10, height: 20,
    contents: [
        new Label({ bottom: 0, top: 0, width: $.width,
        	active: true, skin: blueSkin, style: blackText, string: $.string,
		    behavior: Behavior({
		        onTouchEnded: function(content) {
		        	$.callFunc();
		        },
		    }),
        })
    ]
}));

export var WateredPopup = Container.template($ => ({
    left: 40, right: 40, skin: popupSkin,
    contents: [
     new Column({
         left: 0, right: 0, top: 0, height: 140,
         contents: [
             new StringTemplate({ string: 'Congratulations!', style: greenPopupText}),
             new StringTemplate({ string: 'You just watered your plant. You will need to water it again in '
            	 + $.plant.getWateringTimeStr() + '.', style: grayText }),
             new TextButton({ width: 50, string: "Close", callFunc: $.closeFunc })
         ]
     })
    ]
}));

var PlantProfileScreen = Column.template($ => ({
    left: 0, right: 0, top: 0, bottom: 0, skin: whiteSkin,
    contents: [
        new assets.Header({
			string: "Plant Profile",
			leftElement: new assets.ImgButton({ url: assets.images.back2, callFunc: screenUtils.showHome }),
		}),
        new Label({ name: "plantLabel", top: 5, height: 20, width: 200, style: boldText, string: plant.plantType.name }),
        new Picture({ name: "plantPicture", top: 5, height: 80, width: 80, url: plant.plantType.image }),
        new Label({ name: "wateredLabel", top: 5, height: 20, width: 200, style: blackText, string: "Watered 2 hours ago" }),
        new Label({ name: "wateringLabel", top: 0, height: 20, width: 200, style: blackText, string: "Water in 2 hours " }),
        new Label({ name: "plantedLabel", top: 0, height: 20, width: 200, style: blackText, string: "Planted 2 weeks ago" }),
        new Line({ top: 10, left: 0, right: 0,
        	contents: [
        	    new TextButton({ width: 80, string: "Nutrients" }),
        	    new TextButton({ width: 50, string: "Water", callFunc: waterPlant }),
            ]
        })
    ]
}));

export function waterPlant() {
	if (!plant) {
		return;
	}
	plant.water();
	main.updatePlant(plant);
	
	screenUtils.closePopups();
	let wateredPopup = new WateredPopup({ plant: plant, closeFunc: screenUtils.closePopups });
	refresh();
	screenUtils.showPopup(wateredPopup);
}

export var plant = null;
export var screen = null;

export function getScreen() {
	if (screen) {
		refresh();
		return screen;
	}
	screen = new PlantProfileScreen();
	refresh();
	return screen;
}

export function refresh() {
	if (screen == null) {
		return;
	}
	if (plant != null) {
		if (screen.plantPicture.url != plant.plantType.image) {
			screen.plantPicture.url = plant.plantType.image;
		}
		if (screen.plantLabel.string != plant.plantType.name) {
			screen.plantLabel.string = plant.plantType.name;
		}

		let wateredTime = plant.getWateredTimeStr();
		let wateringTime = plant.getWateringTimeStr();
		let plantedTime = plant.getPlantedTimeStr();
		screen.wateredLabel.string = "Watered " + wateredTime + " ago";
		screen.wateringLabel.string = "Water in " + wateringTime;
		screen.plantedLabel.string = "Planted " + plantedTime + " ago";
	}
}


