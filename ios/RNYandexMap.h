#import "YMKMapView.h"
#import "RCTComponent.h"
#import "RCTView.h"

@interface RNYandexMap : RCTView <YMKMapViewDelegate>

@property (nonatomic, assign) BOOL showMyLocation;
@property (nonatomic, assign) BOOL showTraffic;
@property (nonatomic, assign) BOOL nightMode;
@property (nonatomic, assign) YMKMapRegion region;

@property (nonatomic, copy) RCTDirectEventBlock onMapEvent;

- (void)setRegion:(YMKMapRegion)region animated:(BOOL)animated;
@end