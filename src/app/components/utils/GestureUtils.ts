export class GestureUtils {

    public static lock: string | null = null;

    public static getGestureId() {
        return Math.random().toString(36).substring(2);
    }

    public static getX(e: MouseEvent | TouchEvent) {
        return ('touches' in e) ? e.touches[0].clientX : e.clientX;
    }

    public static getY(e: MouseEvent | TouchEvent) {
        return ('touches' in e) ? e.touches[0].clientY : e.clientY;
    }

    public static clamp(num: number, from: number, to: number) {
        return Math.max(from, Math.min(to, num));
    }

    public static getWidth(element: any) {
        return element.getBoundingClientRect().width;
    }

    public static isHorizontalDrag(e: MouseEvent | TouchEvent, startX: number, startY: number) {
        const deltaX = Math.abs(this.getX(e) - startX);
        const deltaY = Math.abs(this.getY(e) - startY);

        return deltaX > deltaY && deltaY < 5;
    }

    public static isVerticalDrag(e: MouseEvent | TouchEvent, startX: number, startY: number) {
        const deltaX = Math.abs(this.getX(e) - startX);
        const deltaY = Math.abs(this.getY(e) - startY);

        return deltaY > deltaX && deltaX < 5;
    }
}