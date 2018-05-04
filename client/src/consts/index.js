export const SUCCESS_NOTIF = 'SUCCESS_NOTIF';
export const ERROR_NOTIF = 'ERROR_NOTIF';
export const viewInfoConst = 'viewInfo'; 
export const addBlockConst = 'addBlock'; 
export const blocksTarget = 'blocks';
export const DeleteConst = 'Delete';
export const AddEntranceConst = 'AddEntrance';
export const AddFloorConst = 'AddFloor';
export const BLOCK = 'BLOCK';
export const ENTRANCE = 'ENTRANCE';
export const AddApartmentConst = 'AddApartment';
export const APARTMENT = 'APARTMENT';

export const WalmartItem = 'WalmartItem';
export const searchWalmart = 'SearchWalmart';

export const icons = [
	{
		name: 'BLOCK' , 
		icon: 'glyphicon glyphicon-open-file',
		label: 'addBlock',
		action: 'add',
		target: '#newBlock'
	},
	{
		name: 'ENTRANCE' , 
		icon: 'glyphicon glyphicon-home',
		label: 'AddEntrance',
		action: 'add',
		target: '#newEntrance'
		},
	{
		name: 'FLOOR' , 
		icon: 'glyphicon glyphicon-saved',
		label: 'AddFloor',
		action: 'add',
		target: '#newFloor'
	},
	{
		name: 'APARTMENT' , 
		icon: 'glyphicon glyphicon-bed',
		label: 'AddApartment',
		action: 'add',
		target: '#newApartment'
	},
	{
		name: 'PERSON' , 
		icon: 'glyphicon glyphicon-use',
		label: 'AddPerson',
		action: 'add',
		target: '#newPerson'
	},
	{
		name: 'ACOM-BL' , 
		icon: 'glyphicon glyphicon-map-marker',
		label: 'AddBlockAcom',
		action: 'add',
		target: '#newAcomudation'
	},
	{
		name: 'ACOM-ENT' , 
		icon: 'glyphicon glyphicon-bell',
		label: 'AddEntAcom',
		action: 'add',
		target: '#newAcomudation'
	},
	{
		name: 'ACOM-FL' , 
		icon: 'glyphicon glyphicon-tag',
		label: 'AddFloorAcom',
		action: 'add',
		target: '#newAcomudation'
	},
	{
		name: 'ACOM-AP' , 
		icon: 'glyphicon glyphicon-tint',
		label: 'AddApartAcom',
		action: 'add',
		target: '#newAcomudation'
	},
	{
		name: 'INFO' , 
		icon: 'glyphicon glyphicon-info-sign',
		label: 'viewInfo',
		action: 'viewInfo',
		target: 'blocks'
	},
	{
		name: 'INFOBLOCK' , 
		icon: 'glyphicon glyphicon-info-sign',
		label: 'viewInfo',
		action: 'viewInfo',
		target: '#infoLayer'
	},
    {
		name: 'INFOENTRY' , 
		icon: 'glyphicon glyphicon-info-sign',
		label: 'viewEntry',
		action: 'viewEntry',
		target: '#infoLayer'
	},
    {
		name: 'FLOORINFO' , 
		icon: 'glyphicon glyphicon-info-sign',
		label: 'viewFloor',
		action: 'viewFloor',
		target: '#infoLayer'
	},
    
    {
		name: 'APINFO' , 
		icon: 'glyphicon glyphicon-info-sign',
		label: 'viewAppartment',
		action: 'viewAppartment',
		target: '#infoLayer'
	}
	,
	{
		name: 'DELETE' , 
		icon: 'glyphicon glyphicon-trash',
		label: 'Delete',
		action: 'delete',
		target: '#delete'
	}
];