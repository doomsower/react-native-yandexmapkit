#import "RNYandexMapViewManager.h"
#import "YMKMapView.h"
#import "RCTConvert+YMKMapStructs.h"

@implementation RNYandexMapViewManager

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (UIView *)view {
  return [[YMKMapView alloc] init];
}

RCT_REMAP_VIEW_PROPERTY(showMyLocation, showsUserLocation, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showTraffic, BOOL)
RCT_EXPORT_VIEW_PROPERTY(nightMode, BOOL)
RCT_CUSTOM_VIEW_PROPERTY(region, YMKMapRegion, YMKMapView) {
  [view setRegion:json ? [RCTConvert YMKMapRegion:json] : defaultView.region animated:NO];
}

@end

//showBuiltInScreenButtons: PropTypes.bool,
//showFindMeButton: PropTypes.bool,
//showJamsButton: PropTypes.bool,
//showScaleView: PropTypes.bool,
//showZoomButtons: PropTypes.bool,
//interactive: PropTypes.bool,
//hdMode: PropTypes.bool,
//geocodingEnabled: PropTypes.bool,