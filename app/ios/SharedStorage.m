//
//  SharedStorage.m
//  app
//
//  Created by SunWoong Choi on 2021/03/17.
//

#import "SharedStorage.h"
#import "React/RCTLog.h"

@implementation SharedStorage

RCT_EXPORT_MODULE(SharedStorage);

// We can send back a promise to our JavaScript environment :)
RCT_EXPORT_METHOD(plz:(NSString *)data
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  @try{
    //CHANGE THE GROUP HERE
    NSUserDefaults *shared = [[NSUserDefaults alloc]initWithSuiteName:@"group.com.covid.sk"];
    [shared setObject:data forKey:@"data"];
    [shared synchronize];
    resolve(@"true");
  }@catch(NSException *exception){
    reject(@"get_error",exception.reason, nil);
  }

}

@end
