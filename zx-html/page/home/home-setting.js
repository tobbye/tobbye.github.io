function setElems() {
	getAgent();
	setOuterTop();
	// setOuterCenter();
	setAgent();
	setInner();
}


function setOuterTop() {

}

function setOuterCenter() {

	var map = new AMap.Map('container', {
    	// mapsStyle: 'ba2e46da44e5a75289d3d41d895fd45e',
    	mapsStyle: 'amap://styles/whitesmoke',
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom:15, //初始化地图层级
        center: [116.397428, 39.90923] //初始化地图中心点
    });

	AMap.plugin('AMap.Geolocation', function() {
		var geolocation = new AMap.Geolocation({
	    // 是否使用高精度定位，默认：true
	    enableHighAccuracy: true,
	    // 设置定位超时时间，默认：无穷大
	    timeout: 10000,
	    // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
	    buttonOffset: new AMap.Pixel(10, 20),
	    //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
	    zoomToAccuracy: true,     
	    //  定位按钮的排放位置,  RB表示右下
	    buttonPosition: 'RB'
		});

		geolocation.getCurrentPosition()
		AMap.event.addListener(geolocation, 'complete', onComplete);
		AMap.event.addListener(geolocation, 'error', onError);

		function onComplete (data) {
    		// data是具体的定位信息
		}

		function onError (data) {
		    // 定位出错
		}
	});

	AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
		var autoOptions = {
			city: "北京",
			input: "input"
		}
		var autocomplete= new AMap.Autocomplete(autoOptions)

		var placeSearch = new AMap.PlaceSearch({
			city:'北京',
			map:map
		})
		AMap.event.addListener(autocomplete, 'select', function(e){
			placeSearch.search(e.poi.name)
		})
	});

	var markerList = [
		new AMap.Marker({position: [116.39742, 39.9192],  title: '北京' }),
		new AMap.Marker({position: [116.39702, 39.9792],  title: '北京' }),
		new AMap.Marker({position: [116.39542, 39.9592],  title: '北京' }),
		new AMap.Marker({position: [116.39242, 39.9392],  title: '北京' }),
		new AMap.Marker({position: [116.39042, 39.9292],  title: '北京' }),
	];
	for (let x in markerList)
		map.add(markerList[x]);
}