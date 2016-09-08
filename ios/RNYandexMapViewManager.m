#import "RNYandexMapViewManager.h"
#import "YMKMapView.h"
#import "RCTConvert+YMKMapStructs.h"
#import "RCTConvert+CoreLocation.h"
#import "YandexMapKit.h"
#import "RNYandexMap.h"
#import "RCTUIManager.h"
#import "YMKUserLocation.h"

@implementation RNYandexMapViewManager

RCT_EXPORT_MODULE();

- (UIView *)view {
  return [[RNYandexMap alloc] init];
}

- (NSArray *) customDirectEventTypes
{
  return @[
      @"onMapEvent"
  ];
}

RCT_EXPORT_VIEW_PROPERTY(showMyLocation, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showTraffic, BOOL)
RCT_EXPORT_VIEW_PROPERTY(nightMode, BOOL)
RCT_CUSTOM_VIEW_PROPERTY(region, YMKMapRegion, RNYandexMap) {
  [view setRegion:json ? [RCTConvert YMKMapRegion:json] : defaultView.region animated:NO];
}

RCT_EXPORT_VIEW_PROPERTY(onMapEvent, RCTDirectEventBlock)

RCT_EXPORT_METHOD(animateToCoordinate:(nonnull NSNumber *)reactTag
    withCoordinate:(NSDictionary *)coordinate)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    id view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RNYandexMap class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RNYandexMap, got: %@", view);
    } else {
      RNYandexMap *mapView = (RNYandexMap *)view;
      YMKMapCoordinate mapCoordinate;
      if (coordinate == nil) {
        //JS requests to zoom to current user location, but it is not available => do nothing
        if (mapView.userLocation.location == nil)
          return;
        mapCoordinate = mapView.userLocation.location.coordinate;
      }
      else {
        mapCoordinate = [RCTConvert CLLocationCoordinate2D:coordinate];
      }
      [mapView setCenterCoordinate:mapCoordinate animated:YES];
    }
  }];
}

@end