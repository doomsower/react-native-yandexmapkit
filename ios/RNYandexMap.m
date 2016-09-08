#import "UIView+React.h"
#import "YandexMapKit.h"
#import "RNYandexMap.h"


@implementation RNYandexMap {
  YMKMapView *mapView;
  YMKMapRegion _initialRegion;
  BOOL _initialRegionSet;
}

- (instancetype)initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
    mapView = [[YMKMapView alloc] init];
    mapView.delegate = self;
    mapView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    [self addSubview:mapView];
  }

  return self;
}

- (BOOL)showMyLocation {
  return mapView.showsUserLocation;
}

- (void)setShowMyLocation:(BOOL)showMyLocation {
  mapView.showsUserLocation = showMyLocation;
}


- (BOOL)showTraffic {
  return mapView.showTraffic;
}

- (void)setShowTraffic:(BOOL)showTraffic {
  mapView.showTraffic = showTraffic;
}

- (BOOL)nightMode {
  return mapView.nightMode;
}

- (void)setNightMode:(BOOL)nightMode {
  mapView.nightMode = nightMode;
}

- (YMKMapRegion)region {
  return mapView.region;
}

- (void)setRegion:(YMKMapRegion)region {
  if (self.frame.size.width > 0) {
    mapView.region = region;
  }
  else {
    _initialRegion = region;
  }
}

- (void)setRegion:(YMKMapRegion)region animated:(BOOL)animated {
  if (self.frame.size.width > 0) {
    [mapView setRegion:region animated:animated];
  }
  else {
    _initialRegion = region;
  }
}

- (void)layoutSubviews {
  [super layoutSubviews];
  CGFloat mapWidth = mapView.frame.size.width;
  if (mapWidth > 0 && !_initialRegionSet){
    _initialRegionSet = YES;
    [mapView setRegion:_initialRegion animated:NO];
  }
}

- (YMKUserLocation *)userLocation {
  return mapView.userLocation;
}


- (void)setCenterCoordinate:(YMKMapCoordinate)coordinate animated:(BOOL)animated {
  [mapView setCenterCoordinate:coordinate animated:animated];
}

- (void)mapView:(YMKMapView *)yMapView regionDidChangeAnimated:(BOOL)animated {
  if (_onMapEvent && self.frame.size.width > 0){
    YMKMapRegion region = mapView.region;
    NSDictionary *event = @{
          @"latitude": @(region.center.latitude),
          @"longitude": @(region.center.longitude),
          @"latitudeDelta": @(region.span.latitudeDelta),
          @"longitudeDelta": @(region.span.longitudeDelta),
          @"type": @"type is available on Android only",
      };
    _onMapEvent(event);
  }
}



@end