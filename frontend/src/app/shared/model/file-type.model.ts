export class FileInfo {
    public EXT = [
        {id: ExtType.ppt, icon: '/assets/images/mail/attachments_ppt.png'},
        {id: ExtType.pptx, icon: '/assets/images/mail/attachments_ppt.png'},
        {id: ExtType.doc, icon: '/assets/images/mail/attachments_word.png'},
        {id: ExtType.docx, icon: '/assets/images/mail/attachments_word.png'},
        {id: ExtType.xls, icon: '/assets/images/mail/attachments_excel.png'},
        {id: ExtType.pdf, icon: '/assets/images/mail/attachments_pdf.png'},
        {id: ExtType.etc, icon: '/assets/images/mail/attachments_etc.png'},
    ];
}

export interface Ext {
    id: ExtType;
    icon: string;
}

export enum ExtType {
    ppt = 'ppt',
    pptx = 'pptx',
    doc = 'doc',
    docx = 'docx',
    xls = 'xls',
    pdf = 'pdf',
    etc = 'etc',
}

export enum MIME_FILE_TYPE {
    // doc
    MS_WORD = 'application/msword',
    // pdf
    PDF = 'application/pdf',
    // xls
    EXCEL = 'application/vnd.ms-excel',
    // js
    JS = 'application/x-javascript',
    // zip
    ZIP = 'application/zip',
    // jpeg, jpg, jpe
    JPG = 'image/jpeg',
    // css
    CSS = 'text/css',
    // html, htm
    HTML = 'text/html',
    // txt
    TXT = 'text/plain',
    // xml
    XML = 'text/xml',
    // xsl
    XSL = 'text/xsl',
}
