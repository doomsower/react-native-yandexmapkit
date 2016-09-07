#import "RNYandexMapView.h"
#import "YMKMapView.h"

@implementation RNYandexMapView

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (UIView *)view {
  return [[YMKMapView alloc] init];
}

@end