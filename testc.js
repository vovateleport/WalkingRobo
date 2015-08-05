export default {
	baseDir: '/home/robosm/data',
	stylesFile: 'load.styles',
	tasks: [
		{
			name: "azore",
			file: "http://download.geofabrik.de/europe/azores-latest.osm.pbf",
			bbox: {
				//-27.1455001831,38.7216797752,-27.0253372192,38.7907537883
				top: 38.7907537883,
				bottom: 38.7216797752,
				left: -27.0253372192,
				rigth: -27.1455001831
			}
		}
	]
};
