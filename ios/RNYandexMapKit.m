
#import "RNYandexMapKit.h"
#import "YMKConfiguration.h"

@implementation RNYandexMapKit

@synthesize bridge = _bridge;

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(setApiKey: (nonnull NSString *) apiKey) {
    [YMKConfiguration sharedInstance].apiKey = apiKey;
}

@end
  