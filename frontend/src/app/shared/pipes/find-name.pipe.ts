import {Pipe, PipeTransform} from '@angular/core';
import {AllUser} from '@shared/model/user.model';

@Pipe({
    name: 'findName'
})
export class FindNamePipe implements PipeTransform {

    transform(email: string, users: AllUser[]): string {
        if (email && users?.length > 0) {
            const emails = email.replace(/\s|&nbsp;/gi, '').split(',');
            const mailWithName = emails.map(mail => {
                const findUser = users.find(user => user.primaryEmail === mail);
                if (findUser) {
                    return `"${findUser.fullName}" <${findUser.primaryEmail}>`;
                } else {
                    return mail;
                }
            });
            return mailWithName.join(', ');
        }

    }

}
