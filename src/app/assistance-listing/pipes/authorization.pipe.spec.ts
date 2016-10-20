import { AuthorizationPipe } from './authorization.pipe';




describe('AuthorizationPipe', () => {
  let pipe = new AuthorizationPipe();
  it('transforms an authorization id to an authorization', () => {
    // let oAuthorization = [{'Usc':{'section':'7901', 'title': '7'}, 'act':{'description': 'The National Cost Share Program is authorized under 7 U.S.C. 7901 note, as amended by section 10004(c) of the Agriculture Act of 2014 (2014 Farm Bill).'}, 'part':'94', 'section':'7901', 'title':'7', 'authorizationId':'49a6f9eea2ae391421d77f7cd3c71604', 'authorizationType':'act', 'publicLaw':{'congressCode':'113', 'number':'79'}, 'version': '1'}];
    let oAuthorization1 = [{"USC":{"title":"7","section":"7901"},"act":{"part":"94","title":"7","section":"7901","description":"The National Cost Share Program is authorized under 7 U.S.C. 7901 note, as amended by section 10004(c) of the Agriculture Act of 2014 (2014 Farm Bill)."},"version":1,"publicLaw":{"number":"79","congressCode":"113"},"authorizationId":"49a6f9eea2ae391421d77f7cd3c71604","authorizationType":"act"}];
    let result1 = 'The National Cost Share Program is authorized under 7 U.S.C. 7901 note, as amended by section 10004(c) of the Agriculture Act of 2014 (2014 Farm Bill)., Title 7, Part 94, Section 7901';
    let oAuthorization2 = [{"USC":{"title":"49","section":"5308"},"act":{"description":"Safe, Accountable, Flexible, Efficient Transportation Equity Act: A Legacy for Users (SAFETEA-LU)"},"version":1,"publicLaw":{"number":"59","congressCode":"109"},"authorizationId":"eb65d9b0df64c21197fd4ca92833fe40","authorizationType":"publiclaw"}];
    let result2 = 'Public Law 109-N/A';
    let oAuthorization3 = [{"USC":{"title":"42","section":"601 et seq."},"act":{"part":"A","title":"IV","description":"Social Security Act"},"version":1,"authorizationId":"7111d5093e03c6390cdf3d9ed9bbc6e0","authorizationType":"usc"}];
    let result3 = '42 US Code 601 et seq.';
    let oAuthorization4 = [{"act":{"description":"Consolidated Appropriations Act, 2010"},"statute":{"page":"3171","volume":"123"},"version":1,"publicLaw":{"number":"111-117"},"authorizationId":"e59d4373eb0055d8c795cdc578331e1b","authorizationType":"statute"}];
    let result4 = 'Statute 123-3171';
    let oAuthorization5 = [{"version":1,"executiveOrder":{"part":"74 and 92","description":"Federal Regulations 42 CFR 52 and 45"},"authorizationId":"326ccde2aeb4606bc44959c1dfd018a9","authorizationType":"eo"}];
    let result5 = 'Executive Order - N/A';
    expect(pipe.transform(oAuthorization1, [])).toBe(result1);
    expect(pipe.transform(oAuthorization2, [])).toBe(result2);
    expect(pipe.transform(oAuthorization3, [])).toBe(result3);
    expect(pipe.transform(oAuthorization4, [])).toBe(result4);
    expect(pipe.transform(oAuthorization5, [])).toBe(result5);
  });
});
