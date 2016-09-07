#import "YMKMapStructs.h"
#import "RCTConvert.h"

@interface RCTConvert (YMKMapStructs)

+ (YMKMapRegionSize)YMKMapRegionSize:(id)json;
+ (YMKMapRegion)YMKMapRegion:(id)json;

@end