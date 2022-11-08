import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any[], arg: any, columna: string[]): any {
    const resultPosts:any = [];
    if (arg == '') {
      return value;
    }

    for (let i = 0; i < columna.length; i++) {
      for (const post of value) {
        if (String(post[columna[i]])?.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
          if (!resultPosts.includes(post)) {
            resultPosts.push(post);
          }
        }
      }
    }
    return resultPosts;
  }

}
