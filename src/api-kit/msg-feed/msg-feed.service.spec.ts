import { MsgFeedService } from "./msg-feed.service";
import { Observable } from "rxjs/Observable";

let serviceMock = {
    call: (oApiParam)=>{
        if(oApiParam['name']=="rms"){
            return Observable.of({
                _embedded:{
                    domainList: [{
                        isActive:true,
                        id: "aaa",
                        domainName: "bbbb"
                    }]
                }
            });
        } else {
            return Observable.of(true);
        }
    }
};

describe("api-kit/msg-feed/msg-feed.service.spec.ts", ()=>{
    let service: MsgFeedService;

    beforeEach(()=>{
        service = new MsgFeedService(<any>serviceMock);
    });

    it("should process getFilters()",()=>{
        service.getFilters("aaa").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process getDomains()",()=>{
        service.getDomains().subscribe(val=>{
            expect(val['aaa']).toBe("bbbb");
        });
    });
    
    it("should process getFeeds()",()=>{
        //requests
        service.getFeeds("aaa", { 
            section: "requests",
            requestType: ["aaa", "bbb"],
            status: ["aaa", "bbb"],
            orgs: ["aaa", "bbb"]
        }, "ccc", 1, 10).subscribe(val=>{
            expect(val).toBe(true);
        });
        service.getFeeds("aaa", { 
            section: "requests",
        }, "ccc", 1, 10).subscribe(val=>{
            expect(val).toBe(true);
        });

        //notifications
        service.getFeeds("aaa", {
            alertType: ["aaa","bbb"],
            domains: ["aaa","bbb"],
            alertStatus: ["aaa"]
        }, "ccc", 1, 10).subscribe(val=>{
            expect(val).toBe(true);
        });
        service.getFeeds("aaa", {}, "ccc", 1, 10).subscribe(val=>{
            expect(val).toBe(true);
        });
    });

    it("should process addAuthHeader()",()=>{
        document.cookie = "iPlanetDirectoryPro=aaaa; expires=Thu, 18 Dec 2222 12:00:00 UTC; path=/";
        let options = {};
        service.addAuthHeader(options);
        expect(options["headers"]["X-Auth-Token"]).toBe("aaaa");
    });
});