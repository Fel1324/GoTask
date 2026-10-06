import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IComment } from '../../../../domain/tasks/interfaces/comment.interface';
import { ITask } from '../../../../domain/tasks/interfaces/task.interface';
import { generateIdWithTimestamp } from '../../../../shared/utils/generate-id-with-timestamp';

@Component({
  selector: 'app-task-comments-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-comments-modal.component.html'
})
export class TaskCommentsModalComponent {
  taskCommentsChanged = false;
  commentControl = new FormControl('', [Validators.required])

  @ViewChild('commentInput') commentInputRef!: ElementRef<HTMLInputElement>;

  readonly _task: ITask = inject(DIALOG_DATA);
  readonly _dialogRef: DialogRef<boolean> = inject(DialogRef);

  onAddComment(){
    const newComment: IComment = {
      id: generateIdWithTimestamp(),
      description: this.commentControl.value ?? '',
    };

    this._task.comments.unshift(newComment);
    this.commentControl.reset();
    this.taskCommentsChanged = true;

    this.commentInputRef.nativeElement.focus();
  }

  onRemoveComment(commentId: string){
    this._task.comments = this._task.comments.filter(comment => comment.id !== commentId);
    this.taskCommentsChanged = true;
  }

  onCloseModal(){
    this._dialogRef.close(this.taskCommentsChanged);
  }
}
