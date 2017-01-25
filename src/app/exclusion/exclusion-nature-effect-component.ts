import { HostListener, Component, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Component({
  selector: 'exclusionNatureEffect',
  template: `
  <table class="usa-table-borderless">
		<tr>
			<td valign="top" class="table-column-width-450px message-background-color">
				<strong>Nature (Cause):</strong>
				<div *ngIf="classificationType=='Individual'">
					<i>May be subject to sanctions pursuant to the 
					conditions imposed by the U.S. Department of the 
					Treasury (Treasury) Office of Foreign Assets 
					Control (OFAC), or subject to a sanction, 
					restriction or partial denial pursuant to the 
					conditions imposed by the U.S. Department of
					State (STATE) or Federal agency of the U.S.
					Government.</i>
				</div>
				<div *ngIf="classificationType=='Firm'">
					<i>Determined ineligible upon completion 
					of administrative proceedings establishing by
					preponderance of the evidence of a cause of
					a serious and compelling nature that it affects 
					present responsibility; or determined ineligible
					based on other regulation, statute, executive
					order or other legal authority.</i>
				</div>
			</td>
			<td valign="top" class="message-background-color">
				<strong>Effect:</strong>
				<div *ngIf="classificationType=='Individual'">
					<i>If you think you have a potential match with an OFAC listing,
					please visit the following section of OFAC's website for
					guidance: <a target="_blank" href="http://www.treasury.gov/resource-center/faqs/Sanctions/Pages/directions.aspx">
					http://www.treasury.gov/resource-center/faqs/Sanctions/Pages/directions.aspx.</a> For all other prohibitions
					and restrictions, see the agency note in the Additional Comments 
					field to ascertain the extent or limit on the sanction, restriction
					or partial denial. If there is no note, contact the agency taking
					the action for this information.</i>
				</div>
				<div *ngIf="classificationType=='Firm'">
					Procurement:
					<br />
					<i>Agencies shall not solicit offers from, award contracts to renew, place
					new orders with, or otherwise extend the duration of current contracts,
					or consent to subcontracts in excess of $30,000 (other than 
					commercially available off-the-shelf items (COTS)), with these 
					contractors unless the agency head (or designee) determines in 
					writing there is a compelling reason to do so.</i>
					<br />
					<br />
					Nonprocurement:
					<br />
					<i>No agency in the Executive Branch shall enter into, renew, or extend 
					primary or lower tier covered transactions to a participant or principal
					determined ineligible unless the head of the awarding agency grants a 
					compelling reasons exception in writing. Additionally, agencies shall not 
					make awards under certain discretionary Federal assistance, loans,
					benefits (or contracts there under), nor shall an ineligible person 
					participate as a principal, including but not limited to, agent, consultant, 
					or other person in a position to handle, influence or ocntral Federal
					funds, or occupying a technical or professional position capable of 
					substantially influencing the development or outcome of a funded
					activity, nor act as an agent or representative of other participants in 
					Federal assistance, loans and benefits programs. Contact the award
					agency for questions regarding the extent of Nonprocurement
					transaction award ineligibillity. The period of ineligibillity is specified by
					the termination date.</i>
				</div>
			</td>
		</tr>
	</table>
  `
})
export class ExclusionNatureEffect implements OnInit {
  
  @Input() classificationType: any;

  constructor( ) {}

  ngOnInit(){
  }

}

