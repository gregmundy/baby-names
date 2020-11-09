import { render, screen } from '@testing-library/react';
import Nametag from './NameTag';

describe('NameTag', () => {
    test('Renders a given name in the nametag component', () => {
        const names = ['Greg', 'Meg', 'Banana', 'Coco'];
        names.forEach((name) => {
            render(<Nametag name={name} />);
            expect(screen.getByText(name)).toBeInTheDocument();
        });
    });
});