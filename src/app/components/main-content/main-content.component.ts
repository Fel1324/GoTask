import { Component } from '@angular/core';
import { WelcomeSectionComponent } from "../welcome-section/welcome-section.component";
import { TaskListSectionComponent } from "../task-list-section/task-list-section.component";

@Component({
  selector: 'app-main-content',
  imports: [WelcomeSectionComponent, TaskListSectionComponent],
  templateUrl: './main-content.component.html'
})
export class MainContentComponent {

}
