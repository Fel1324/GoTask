import { Component } from '@angular/core';
import { TaskCardComponent } from "../task-card/task-card.component";

@Component({
  selector: 'app-task-list-section',
  imports: [TaskCardComponent],
  templateUrl: './task-list-section.component.html'
})
export class TaskListSectionComponent {

}
