import { HostListener, Component, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Component({
  selector: 'exclusionNatureEffect',
  template: `
  <div class="sam-ui lightest blue segment">
    <div class="sam-ui two column grid">
      <div class="column">
        <div class="sam-ui medium header">Nature (Cause)</div>
        <p *ngIf="classificationType=='Individual' || classificationType=='Vessel'">
          <em>
            May be subject to sanctions pursuant to the 
            conditions imposed by the U.S. Department of the 
            Treasury (Treasury) Office of Foreign Assets 
            Control (OFAC), or subject to a sanction, 
            restriction or partial denial pursuant to the 
            conditions imposed by the U.S. Department of
            State (STATE) or Federal agency of the U.S.
            Government.
          </em>
        </p>
        <p *ngIf="classificationType=='Firm'">
          <em>
            Determined ineligible upon completion 
            of administrative proceedings establishing by
            preponderance of the evidence of a cause of
            a serious and compelling nature that it affects 
            present responsibility; or determined ineligible
            based on other regulation, statute, executive
            order or other legal authority.
          </em>
        </p>
        <p *ngIf="classificationType=='Special Entity Designation'">
          <em>
            Preliminary ineligible based upon adequate
            evidence of conduct indicating a lack of
            business honesty or integrity, or a lack of
            business integrity, or regulation, statute,
            executive order or other legal authority,
            pending completion of an investigation and/or
            legal proceedings; or based upon initiation of
            proceedings to determine final ineligibility
            based upon regulation, statue, executive
            order or other legal authority or a lack of
            business integrity or a preponderance of the
            evidence of any other cause of a serious and
            compelling nature that it affects present
            responsibility.
          </em>
        </p>
      </div>
      <div class="column">
        <div class="sam-ui medium header">Effect</div>
        <p *ngIf="classificationType=='Individual' || classificationType=='Vessel'">
          <em>
            If you think you have a potential match with an OFAC listing,
            please visit the following section of OFAC's website for
            guidance: <a target="_blank" href="http://www.treasury.gov/resource-center/faqs/Sanctions/Pages/directions.aspx">
            http://www.treasury.gov/resource-center/faqs/Sanctions/Pages/directions.aspx.</a> 
            For all other prohibitions and restrictions, see the agency note in 
            the Additional Comments field to ascertain the extent or limit on 
            the sanction, restriction or partial denial. If there is no note, 
            contact the agency taking the action for this information.
          </em>
        </p>
        <ng-container *ngIf="classificationType=='Firm'">
          <strong>Procurement:</strong>
          <p>
            <em>
              Agencies shall not solicit offers from, award contracts to renew, place
              new orders with, or otherwise extend the duration of current contracts,
              or consent to subcontracts in excess of $30,000 (other than 
              commercially available off-the-shelf items (COTS)), with these 
              contractors unless the agency head (or designee) determines in 
              writing there is a compelling reason to do so.
            </em>
          </p>

          <strong>Nonprocurement:</strong>
          <p>
            <em>
              No agency in the Executive Branch shall enter into, renew, or extend 
              primary or lower tier covered transactions to a participant or principal
              determined ineligible unless the head of the awarding agency grants a 
              compelling reasons exception in writing. Additionally, agencies shall not 
              make awards under certain discretionary Federal assistance, loans,
              benefits (or contracts there under); nor shall an ineligible person 
              participate as a principal, including but not limited to, agent, consultant, 
              or other person in a position to handle, influence or contral Federal
              funds, or occupying a technical or professional position capable of 
              substantially influencing the development or outcome of a funded
              activity; nor act as an agent or representative of other participants in 
              Federal assistance, loans and benefits programs. Contact the award
              agency for questions regarding the extent of Nonprocurement
              transaction award ineligibillity. The period of ineligibillity is specified by
              the termination date.
            </em>
          </p>
        </ng-container>
        <ng-container *ngIf="classificationType=='Special Entity Designation'">
          <strong>Procurement:</strong>
          <p>
            <em>
              Agencies shall not solicit offers from, award contracts to renew, place
              new orders with, or otherwise extend the duration of current contracts,
              or consent to subcontracts in excess of $30,000 (other than 
              commercially available off-the-shelf items (COTS)), with these 
              contractors unless the agency head (or designee) determines in 
              writing there is a compelling reason to do so.
            </em>
          </p>
          
          <strong>Nonprocurement:</strong>
          <p>
            <em>
            No agency in the Executive Branch shall enter into, renew, or extend 
            primary or lower tier covered transactions to a participant or principal
            determined preliminarily ineligible unless the head of the awarding agency grants a 
            compelling reasons exception in writing. Additionally, agencies shall not 
            make awards under certain discretionary Federal assistance, loans,
            benefits (or contracts there under); nor shall an ineligible person 
            participate as a principal, including but not limited to, agent, consultant, 
            or other person in a position to handle, influence or control Federal
            funds, or occupying a technical or professional position capable of 
            substantially influencing the development or outcome of a funded
            activity; nor act as an agent or representative of other participants in 
            Federal assistance, loans and benefits programs. Contact the award
            agency for questions regarding the extent of Nonprocurement
            transaction award ineligibillity. The termination date will
            be listed as "Indefinite" (Indef.) unless otherwise specified.
            </em>
          </p>
        </ng-container>
      </div>
    </div>
  </div>
  `
})
export class ExclusionNatureEffect implements OnInit {
  
  @Input() classificationType: any;

  constructor( ) {}

  ngOnInit(){
  }

}

