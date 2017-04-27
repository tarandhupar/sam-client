import { AuthorizationPipe } from './authorization.pipe';




describe('AuthorizationPipe', () => {
  let pipe = new AuthorizationPipe();
  it('transforms an authorization id to an authorization', () => {
    let oAuthorization1 = [{
      USC: {
        title: "7",
        section: "427-427i, 1624"
      },
      act: {
        description: "Food Security Act of 1985"
      },
      publicLaw: {
        number: "198",
        congressCode: "99"
      },
      authorizationId: "267dd7f6835044126fd8f7bb75563cdd",
      "authorizationTypes": {
        "act": true,
        "executiveOrder": false,
        "publicLaw": true,
        "statute": false,
        "USC": true
      }
    }];
    let result1 = 'Food Security Act of 1985, Public Law 99-198, 7 US Code 427-427i, 1624';
    let oAuthorization2 = [{
      USC: {
        title: "7",
        section: "2131-2155"
      },
      act: {
        description: "Animal Welfare Act, as amended"
      },
      authorizationId: "1742fde5e30e4a248da6c5b22fa01a23",
      "authorizationTypes": {
        "act": true,
        "executiveOrder": false,
        "publicLaw": false,
        "statute": false,
        "USC": true
      }
    }];
    let result2 = 'Animal Welfare Act, as amended, 7 US Code 2131-2155';
    let oAuthorization3 = [{
      USC: {
        title: "E",
        section: "10401-10418"
      },
      act: {
        description: "Farm Security and Rural Investment Act of 2002"
      },
      publicLaw: {
        number: "171",
        congressCode: "107"
      },
      authorizationId: "19de595ca8d70fbce21e48282052d55f",
      "authorizationTypes": {
        "act": true,
        "executiveOrder": false,
        "publicLaw": true,
        "statute": false,
        "USC": true
      }
    }];
    let result3 = 'Farm Security and Rural Investment Act of 2002, Public Law 107-171, E US Code 10401-10418';
    let oAuthorization4 = [{
      USC: {
        title: "7",
        section: "7701-7772"
      },
      act: {
        description: "Plant Protection Act"
      },
      publicLaw: {
        number: "224",
        congressCode: "106"
      },
      authorizationId: "7907af1123839132c1ddc7544ddc5c65",
      "authorizationTypes": {
        "act": true,
        "executiveOrder": false,
        "publicLaw": true,
        "statute": false,
        "USC": true
      }
    }];
    let result4 = 'Plant Protection Act, Public Law 106-224, 7 US Code 7701-7772';
    expect(pipe.transform(oAuthorization1, [])).toBe(result1);
    expect(pipe.transform(oAuthorization2, [])).toBe(result2);
    expect(pipe.transform(oAuthorization3, [])).toBe(result3);
    expect(pipe.transform(oAuthorization4, [])).toBe(result4);
  });
});
