module.exports = {
	baseDir: '/home/robosm/data',
	stylesFile: 'userStyles.json',
	tasks: [
		{
			name: "azore",
			file: "http://download.geofabrik.de/europe/azores-latest.osm.pbf",
			bbox: {
				top: 38.7907537883,
				bottom: 38.7216797752,
				left: -27.0253372192,
				rigth: -27.1455001831
			}
		},
		{
			name: "azore2",
			file: "http://download.geofabrik.de/europe/azores-latest.osm.pbf",
			bbox: {
				top: 38.7907537883,
				bottom: 38.7216797752,
				left: -27.0253372192,
				rigth: -27.1455001831
			}
		},
		{
			name: "gis",
			file: "http://download.geofabrik.de/europe/russia-european-part-latest.osm.pbf",
			bbox: {
				top: 55.96,
				bottom: 55.53,
				left: 37.34,
				rigth: 37.89
			}
		}
	]
};
