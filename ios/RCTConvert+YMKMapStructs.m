#import "RCTConvert+YMKMapStructs.h"
#import "RCTConvert+CoreLocation.h"
#import "YMKMapStructs.h"

@implementation RCTConvert(YMKMapStructs)

RCT_CONVERTER(YMKMapDegrees, YMKMapDegrees, doubleValue);

+ (YMKMapRegionSize)YMKMapRegionSize:(id)json {
  json = [self NSDictionary:json];
  return (YMKMapRegionSize){
      [self YMKMapDegrees:json[@"latitudeDelta"]],
      [self YMKMapDegrees:json[@"longitudeDelta"]]
  };
}

+ (YMKMapRegion)YMKMapRegion:(id)json {
  json = [self NSDictionary:json];
  YMKMapRegion result;
  result.center = [self CLLocationCoordinate2D:json];
  result.span = [self YMKMapRegionSize:json];

  return result;
}

@end