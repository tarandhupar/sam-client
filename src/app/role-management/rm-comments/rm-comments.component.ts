import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { CommentsService } from './comments.service';
import { Comment } from "sam-ui-kit/components/comments";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";

@Component({
  selector: 'rm-comments',
  templateUrl: `
  <section class="sam-comments">
    <p class="button-row" *ngIf="comments.length > maxCommentsBeforeHiding">
      <a (click)="toggleShowMore()">{{showMore ? 'Hide Previous Comments' : 'Show All Comments'}}</a>
    </p>
    <!-- List of comments -->
    <ul class="usa-unstyled-list">
      <li *ngFor="let comment of visibleComments();">
        <sam-comment [comment]="comment" [allowDelete]="false">
          <div *ngIf="comment.extra" [innerHTML]="comment.extra"></div>
        </sam-comment>
      </li>
    </ul>
    <!-- New Comment Form -->
    <form [formGroup]="form" (submit)="onSubmit()" *ngIf="newCommentsEnabled">
      <div class="clearfix">
        <label for="comment-component-input">
          Write A Comment
          <span style="font-weight: 400" class="pull-right" [style.color]="overLimit() ? 'red' : 'black'">{{ charsRemaining() }} characters remaining</span>
        </label>
      </div>
      <span class="usa-input-error-message" *ngIf="error">{{error}}</span>
      <textarea formControlName="comment" id="comment-component-input"></textarea>

      <div class="clearfix">
        <sam-button class="pull-right" [buttonType]="'submit'" [buttonText]="'submit'" [buttonDisabled]="form.controls.comment.disabled"></sam-button>
      </div>
    </form>
  </section>
  `,
})
export class RmCommentsComponent implements OnInit {
  @Input() public maxLength: number = 250;
  @Input() public maxCommentsBeforeHiding = 5;
  @Input() public comments: Array<Comment> = [];
  @Input() public newCommentsEnabled: boolean = true;

  // A function callback that takes the submitted comment as input and returns an observable which
  // makes the network call to post a message
  @Input() public postCB: (text: string) => Observable<Comment>;

  public form: any;
  private showMore: boolean = false;
  private error: string;

  constructor(private fb: FormBuilder, private alerts: AlertFooterService) {}

  ngOnInit() {
    this.form = this.fb.group({
      comment: ['', [Validators.required, Validators.maxLength(this.maxLength)]],
    });
  }

  showErrors() {
    const control = this.form.get('comment');
    if (control.errors.required) {
      this.error = "Comment cannot be empty.";
    }
    console.log(control.errors);

    if (control.errors.maxlength) {
      this.error = `Comment must be no more than ${this.maxLength} characters`;
    }
  }

  onSubmit() {
    this.error = '';
    if (!this.form.valid) {
      this.showErrors();
      return;
    }
    this.form.get('comment').disable();
    const post$ = this.postCB(this.form.value.comment);
    post$.subscribe(
      (comment: Comment) => {
        this.comments.push(comment);
        this.maxCommentsBeforeHiding++;
        this.form.patchValue({
          comment: ''
        });
        this.form.get('comment').enable();
      },
      err => {
        this.form.get('comment').enable();
        this.alerts.registerFooterAlert({
          type: 'error',
          description: 'Unable to submit comment at this time. Please try again.'
        });
      }
    )
  }

  visibleComments() {
    if (this.showMore) {
      return this.comments;
    } else {
      return this.comments.slice(-this.maxCommentsBeforeHiding);
    }
  }

  charsRemaining(): number {
    const textLength = this.form.controls.comment.value ? this.form.controls.comment.value.length : 0;
    return this.maxLength - textLength;
  }

  overLimit(): boolean {
    const textLength = this.form.controls.comment.value ? this.form.controls.comment.value.length : 0;
    return textLength > this.maxLength;
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
  }
}
