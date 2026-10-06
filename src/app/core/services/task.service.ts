import { Injectable } from "@angular/core";
import { BehaviorSubject, map, tap } from "rxjs";
import { generateIdWithTimestamp } from "../../shared/utils/generate-id-with-timestamp";
import { TaskStatusEnum } from "../../domain/tasks/enums/task-status.enum";
import { TaskStatus } from "../../domain/tasks/types/task-status";
import { IComment } from "../../domain/tasks/interfaces/comment.interface";
import { ITask } from "../../domain/tasks/interfaces/task.interface";
import { ITaskFormControls } from "../interfaces/task-form-controls.interface";

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  // Tarefas em a fazer
  private toDoTasks$ = new BehaviorSubject<ITask[]>(this.loadTasksFromLocalStorage(TaskStatusEnum.TODO));
  readonly toDoTasks = this.toDoTasks$.asObservable().pipe(
    map((tasks) => structuredClone(tasks)),
    tap((tasks) => this.saveTasksOnLocalStorage(TaskStatusEnum.TODO, tasks))
  );

  // Tarefas em fazendo
  private doingTasks$ = new BehaviorSubject<ITask[]>(this.loadTasksFromLocalStorage(TaskStatusEnum.DOING));
  readonly doingTasks = this.doingTasks$.asObservable().pipe(
    map((tasks) => structuredClone(tasks)),
    tap((tasks) => this.saveTasksOnLocalStorage(TaskStatusEnum.DOING, tasks))
  );

  // Tarefas em concluído
  private doneTasks$ = new BehaviorSubject<ITask[]>(this.loadTasksFromLocalStorage(TaskStatusEnum.DONE));
  readonly doneTasks = this.doneTasks$.asObservable().pipe(
    map((tasks) => structuredClone(tasks)),
    tap((tasks) => this.saveTasksOnLocalStorage(TaskStatusEnum.DONE, tasks))
  );

  addTask(taskInfos: ITaskFormControls) {
    const newTask: ITask = {
      ...taskInfos,
      status: TaskStatusEnum.TODO,
      id: generateIdWithTimestamp(),
      comments: [],
    };

    const currentList = this.toDoTasks$.value;

    this.toDoTasks$.next([...currentList, newTask])
  }

  updateTaskStatus(taskId: string, taskCurrentStatus: TaskStatus, taskNextStatus: TaskStatus) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const nextTaskList = this.getTaskListByStatus(taskNextStatus);

    const currentTask = currentTaskList.value.find(task => task.id === taskId);

    if(currentTask) {
      // Atualizando o status da tarefa
      currentTask.status = taskNextStatus;

      // Removendo a tarefa da lista atual
      const currentTaskListWithoutTask = currentTaskList.value.filter(task => task.id !== taskId);
      currentTaskList.next([...currentTaskListWithoutTask]);

      // Adicionando a tarefa na nova lista
      nextTaskList.next([...nextTaskList.value, {...currentTask}]);
    }
  }

  updateTaskNameAndDesc(taskId: string, taskCurrentStatus: TaskStatus, newTaskName: string, newTaskDesc: string) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const currentTaskIndex = currentTaskList.value.findIndex((task) => task.id === taskId);

    if(currentTaskIndex > -1) {
      const updatedTaskList = [...currentTaskList.value];

      updatedTaskList[currentTaskIndex] = {
        ...updatedTaskList[currentTaskIndex],
        name: newTaskName,
        description: newTaskDesc,
      }

      currentTaskList.next(updatedTaskList);
    }
  }

  updateTaskComments(taskId: string, taskCurrentStatus: TaskStatus, newTaskComments: IComment[]) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const currentTaskIndex = currentTaskList.value.findIndex(task => task.id === taskId);

    if(currentTaskIndex > -1) {
      const updatedTaskList = [...currentTaskList.value];

      updatedTaskList[currentTaskIndex] = {
        ...updatedTaskList[currentTaskIndex],
        comments: [...newTaskComments],
      };

      currentTaskList.next(updatedTaskList);
    }
  }

  deleteTask(taskId: string, taskCurrentStatus: TaskStatus) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const newTaskList = currentTaskList.value.filter(task => task.id !== taskId);

    currentTaskList.next(newTaskList);
  }

  private loadTasksFromLocalStorage(key: string) {
    try {
      const storageTasks = localStorage.getItem(key);
      return storageTasks ? JSON.parse(storageTasks) : [];
    } catch (error) {
      console.error('Erro ao carregar tarefas no local storage', error);
      return [];
    }
  }

  private saveTasksOnLocalStorage(key: string, tasks: ITask[]) {
    try {
      localStorage.setItem(key, JSON.stringify(tasks));
    } catch (error) {
      console.error('Erro ao salvar tarefas no localStorage', error);
    }
  }

  private getTaskListByStatus(taskStatus: TaskStatus) {
    const taskListObj = {
      [TaskStatusEnum.TODO]: this.toDoTasks$,
      [TaskStatusEnum.DOING]: this.doingTasks$,
      [TaskStatusEnum.DONE]: this.doneTasks$,
    };

    return taskListObj[taskStatus];
  }
}
