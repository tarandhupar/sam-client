import { AuthorizationPipe } from './authorization.pipe';




describe('AuthorizationPipe', () => {
  let pipe = new AuthorizationPipe();
  it('transforms an authorization id to an authorization', () => {
    // let oAuthorization = [{'Usc':{'section':'7901', 'title': '7'}, 'act':{'description': 'The National Cost Share Program is authorized under 7 U.S.C. 7901 note, as amended by section 10004(c) of the Agriculture Act of 2014 (2014 Farm Bill).'}, 'part':'94', 'section':'7901', 'title':'7', 'authorizationId':'49a6f9eea2ae391421d77f7cd3c71604', 'authorizationType':'act', 'publicLaw':{'congressCode':'113', 'number':'79'}, 'version': '1'}];
    let oAuthorization1 = [{
      USC: {
        title: "7",
        section: "427-427i, 1624"
      },
      act: {
        description: "Food Security Act of 1985"
      },
      version: 1,
      publicLaw: {
        number: "198",
        congressCode: "99"
      },
      authorizationId: "267dd7f6835044126fd8f7bb75563cdd",
      authorizationType: "publiclaw"
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
      version: 1,
      authorizationId: "1742fde5e30e4a248da6c5b22fa01a23",
      authorizationType: "usc"
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
      version: 1,
      publicLaw: {
        number: "171",
        congressCode: "107"
      },
      authorizationId: "19de595ca8d70fbce21e48282052d55f",
      authorizationType: "publiclaw"
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
      version: 1,
      publicLaw: {
        number: "224",
        congressCode: "106"
      },
      authorizationId: "7907af1123839132c1ddc7544ddc5c65",
      authorizationType: "publiclaw"
    }];
    let result4 = 'Plant Protection Act, Public Law 106-224, 7 US Code 7701-7772';
    // let oAuthorization5 = [{"version":1,"executiveOrder":{"part":"74 and 92","description":"Federal Regulations 42 CFR 52 and 45"},"authorizationId":"326ccde2aeb4606bc44959c1dfd018a9","authorizationType":"eo"}];
    // let result5 = 'Executive Order - N/A';
    expect(pipe.transform(oAuthorization1, [])).toBe(result1);
    expect(pipe.transform(oAuthorization2, [])).toBe(result2);
    expect(pipe.transform(oAuthorization3, [])).toBe(result3);
    expect(pipe.transform(oAuthorization4, [])).toBe(result4);
    //expect(pipe.transform(oAuthorization5, [])).toBe(result5);
  });
});
