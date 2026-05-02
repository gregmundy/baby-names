import { render, screen } from '@testing-library/react';
import Nametag from './NameTag';

describe('NameTag', () => {
    test('Renders a given name in the nametag component', () => {
        const names = ['Greg', 'Meg', 'Banana', 'Coco'];
        names.forEach((name, i) => {
            render(<Nametag name={name} index={i} />);
            expect(screen.getByText(name)).toBeInTheDocument();
        });
    });
});