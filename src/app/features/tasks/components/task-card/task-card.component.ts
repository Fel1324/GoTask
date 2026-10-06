import { Component, inject, Input } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { ModalControllerService } from '../../../../core/services/modal-controller.service';
import { TaskService } from '../../../../core/services/task.service';
import { ITask } from '../../../../domain/tasks/interfaces/task.interface';

@Component({
  selector: 'app-task-card',
  imports: [SlicePipe],
  templateUrl: './task-card.component.html'
})
export class TaskCardComponent {
  @Input({ required: true }) task!: ITask;
  private readonly _taskService = inject(TaskService)
  private readonly _modalControllerService = inject(ModalControllerService);

  openEditTaskModal() {
    const dialogRef = this._modalControllerService.openEditTaskModal({
      name: this.task.name,
      description: this.task.description
    });

    dialogRef.closed.subscribe((taskForm) => {
      if(taskForm) {
        this._taskService.updateTaskNameAndDesc(
          this.task.id,
          this.task.status,
          taskForm.name,
          taskForm.description,
        );
      }
    })
  }

  openTaskCommentsModal() {
    const dialogRef = this._modalControllerService.openTaskCommentsModal(this.task);

    dialogRef.closed.subscribe((taskCommentsChanged) => {
      if(taskCommentsChanged) {
        this._taskService.updateTaskComments(this.task.id, this.task.status, this.task.comments);
      }
    })
  }

  deleteTask() {
    this._taskService.deleteTask(this.task.id, this.task.status);
  }
}
