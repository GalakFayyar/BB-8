import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'CheckState'
})
export class CheckState implements PipeTransform{

  transform(tab, col) {
    return tab.filter(tab => {
      return tab.name == col.name && tab.state == true;
    });
  }

}