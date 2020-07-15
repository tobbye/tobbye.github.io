

var testData = {
	logoSetting: {
		multiX: 1,
		multiY: 1,
		width: 440,
		height:440,
		lineWidth: 10,
		lineLength: 30,
		fontStyle: "40px bold 黑体",
	},
	logoText: [
		{text:'文本1', textPos:[[ 1,-0.33],[ 1,-0.33],[0,-0.66]], pos:[[0,0], [ 2, 0], [ 1, 1]], rotate:[0,  0,  60], fillStyle:'#FFC000'},
		{text:'文本2', textPos:[[ 0,-0.66],[ 0,-0.66],[0,-0.66]], pos:[[0,0], [ 1, 1], [-1, 1]], rotate:[0,  0, 300], fillStyle:'#0070C0'},
		{text:'文本3', textPos:[[-1,-0.33],[-1,-0.33],[0,-0.66]], pos:[[0,0], [-1, 1], [-2, 0]], rotate:[0,  0, 300], fillStyle:'#FF0000'},
		{text:'文本4', textPos:[[-1, 0.33],[ 1,-0.33],[0,-0.66]], pos:[[0,0], [-2, 0], [-1,-1]], rotate:[0,180, 300], fillStyle:'#FF0000'},
		{text:'文本5', textPos:[[ 0, 0.66],[ 0,-0.66],[0,-0.66]], pos:[[0,0], [-1,-1], [ 1,-1]], rotate:[0,  0, 300], fillStyle:'#0070C0'},
		{text:'文本6', textPos:[[ 1, 0.33],[-1,-0.33],[0,-0.66]], pos:[[0,0], [ 1,-1], [ 2, 0]], rotate:[0,  0, 300], fillStyle:'#FFC000'},
	],

	logoCells: [
		{text:'文本7', rotate: 0.0, textPos:[0, -1.2], fillStyle:'#fff', pos:[[0,0],[-5.7,-2],[5.7,-2], [0,0]]},
		{text:'文本8', rotate: 0.3, textPos:[-3, 1], fillStyle:'#fff', pos:[[0,0],[-6,-2],[-6,2],[0,4]]},
		{text:'文本9', rotate: -0.6, textPos:[ 3, 1], fillStyle:'#fff', pos:[[0,0],[6,-2],[6,2], [0,4]]},
		],
	logoStyle: [
		{
			drawTran: [-176, 100],
			drawRote: -0.48,
			paintTran: [-303, 80],
			paintRote: -0.64,
			lines:[
			{color:'red',		tranX:72, tranY:-29, rotate:0.16},
			{color:'orange',	tranX:72, tranY:-29, rotate:0.16},
			{color:'yellow',	tranX:72, tranY:-29, rotate:0.16},
			{color:'green',		tranX:72, tranY:-29, rotate:0.16},
			{color:'cyan',		tranX:72, tranY:-29, rotate:0.16},
			{color:'blue',		tranX:72, tranY:-29, rotate:0.16},
			{color:'purple',	tranX:72, tranY:-29, rotate:0.16},
			]
		},

		 {
			drawTran: [-192, 100],
			drawRote: -0.48,
			paintTran: [-308, 50],
			paintRote: -0.64,
			lines:[
			{color:'red',		tranX:75, tranY:  1, rotate:0.16},
			{color:'orange',	tranX:75, tranY:-59, rotate:0.16},
			{color:'yellow',	tranX:75, tranY:  1, rotate:0.16},
			{color:'green',		tranX:75, tranY:-59, rotate:0.16},
			{color:'cyan',		tranX:75, tranY:  1, rotate:0.16},
			{color:'blue',		tranX:75, tranY:-59, rotate:0.16},
			{color:'purple',	tranX:75, tranY:  1, rotate:0.16},
			]
		},

		 {
			drawTran: [-150,-140],
			drawRote: 0,
			paintTran: [-200, 100],
			paintRote: 0,
			lines:[
			{color:'red',		tranX:50, tranY:-20, rotate:0},
			{color:'orange',	tranX:50, tranY:-20, rotate:0},
			{color:'yellow',	tranX:50, tranY:-20, rotate:0},
			{color:'green',		tranX:50, tranY: 20, rotate:0},
			{color:'cyan',		tranX:50, tranY: 20, rotate:0},
			{color:'blue',		tranX:50, tranY: 20, rotate:0},
			{color:'purple',	tranX:50, tranY: 20, rotate:0},
			]
		}
	],
}

