#import "RNYandexMapViewManager.h"
#import "YMKMapView.h"
#import "RCTConvert+YMKMapStructs.h"
#import "RNYandexMap.h"

@implementation RNYandexMapViewManager

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (UIView *)view {
  return [[RNYandexMap alloc] init];
}

- (NSArray *) customDirectEventTypes
{
  return @[
      @"onMapEvent"
  ];
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_VIEW_PROPERTY(showMyLocation, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showTraffic, BOOL)
RCT_EXPORT_VIEW_PROPERTY(nightMode, BOOL)
RCT_CUSTOM_VIEW_PROPERTY(region, YMKMapRegion, RNYandexMap) {
  [view setRegion:json ? [RCTConvert YMKMapRegion:json] : defaultView.region animated:NO];
}

RCT_EXPORT_VIEW_PROPERTY(onMapEvent, RCTDirectEventBlock)

@end

//showBuiltInScreenButtons: PropTypes.bool,
//showFindMeButton: PropTypes.bool,
//showJamsButton: PropTypes.bool,
//showScaleView: PropTypes.bool,
//showZoomButtons: PropTypes.bool,
//interactive: PropTypes.bool,
//hdMode: PropTypes.bool,
//geocodingEnabled: PropTypes.bool,