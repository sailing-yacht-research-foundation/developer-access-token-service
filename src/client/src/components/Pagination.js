import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';


const NEXT_PAGE = 'NEXT';
const PREV_PAGE = 'PREV';

/**
 * Helper method for creating a range of numbers
 * range(1, 5) => [1, 2, 3, 4, 5]
 */
const range = (from, to, step = 1) => {
    let i = from;
    const range = [];

    while (i <= to) {
        range.push(i);
        i += step;
    }

    return range;
}

const Pagination = (props) => {

    const [state, setState] = useState({
        pageLimit: null,
        totalRecords: null,
        pageNeighbours: null,
        currentPage: 1,
        totalPages: null
    })

    const getTotalPages = () => {

        return Math.ceil(props.totalRecords / props.pageLimit);
    }

    const gotoPage = page => {
        const { onPageChanged = f => f } = props;

        const currentPage = Math.max(1, Math.min(page, getTotalPages()));

        const paginationData = {
            currentPage,
            totalPages: state.totalPages,
            pageLimit: props.pageLimit,
            totalRecords: props.totalRecords
        };

        setState({ ...state, currentPage })
        onPageChanged(paginationData)
    }

    useEffect(() => {
        let { totalRecords, pageLimit, pageNeighbours } = props;

        pageLimit = typeof pageLimit === 'number' ? pageLimit : 30;
        totalRecords = typeof totalRecords === 'number' ? totalRecords : 0;

        // pageNeighbours can be: 0, 1 or 2
        pageNeighbours = typeof pageNeighbours === 'number'
            ? Math.max(0, Math.min(pageNeighbours, 2))
            : 0;

        let totalPagesCount = Math.ceil(totalRecords / pageLimit);
        let newState = {
            ...state,
            pageLimit,
            totalRecords,
            pageNeighbours,
            totalPagesCount,
            currentPage: 1
        }

        setState(newState)
        gotoPage(1)
    }, [props.totalRecords])


    const handleClick = page => evt => {
        evt.preventDefault();
        gotoPage(page);
    }

    const handleMoveLeft = evt => {
        evt.preventDefault();
        gotoPage(state.currentPage - (props.pageNeighbours * 2) - 1);
    }

    const handleMoveRight = evt => {
        evt.preventDefault();
        gotoPage(state.currentPage + (props.pageNeighbours * 2) + 1);
    }


    const handleNext = evt => {
        evt.preventDefault();
        gotoPage(state.currentPage + 1);
    }

    const handlePrev = evt => {
        evt.preventDefault();
        gotoPage(state.currentPage - 1);
    }

    /**
     * Let's say we have 10 pages and we set pageNeighbours to 2
     * Given that the current page is 6
     * The pagination control will look like the following:
     *
     * (1) < {4 5} [6] {7 8} > (10)
     *
     * (x) => terminal pages: first and last page(always visible)
     * [x] => represents current page
     * {...x} => represents page neighbours
     */
    const fetchPageNumbers = () => {

        const totalPages = getTotalPages();
        const currentPage = state.currentPage;
        const pageNeighbours = props.pageNeighbours;

        /**
         * totalNumbers: the total page numbers to show on the control
         * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
         */
        const totalNumbers = (props.pageNeighbours * 2) + 3;
        const totalBlocks = totalNumbers + 2;

        const hasNext = currentPage < totalPages
        const hasPrevious = currentPage > 1
        if (totalPages > totalBlocks) {

            const startPage = Math.max(2, currentPage - pageNeighbours);
            const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

            let pages = range(startPage, endPage);

            /**
             * hasLeftSpill: has hidden pages to the left
             * hasRightSpill: has hidden pages to the right
             * spillOffset: number of hidden pages either to the left or to the right
             */
            const hasLeftSpill = startPage > 2;
            const hasRightSpill = (totalPages - endPage) > 1;
            const spillOffset = totalNumbers - (pages.length + 1);

            switch (true) {
                // handle: (1) < {5 6} [7] {8 9} (10)
                case (hasLeftSpill && !hasRightSpill): {
                    const extraPages = range(startPage - spillOffset, startPage - 1);
                    pages = [LEFT_PAGE, ...extraPages, ...pages];
                    break;
                }

                // handle: (1) {2 3} [4] {5 6} > (10)
                case (!hasLeftSpill && hasRightSpill): {
                    const extraPages = range(endPage + 1, endPage + spillOffset);
                    pages = [...pages, ...extraPages, RIGHT_PAGE];
                    break;
                }

                // handle: (1) < {4 5} [6] {7 8} > (10)
                case (hasLeftSpill && hasRightSpill):
                default: {
                    pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
                    break;
                }
            }


            pages = [1, ...pages, totalPages];

            if (hasNext) pages.push(NEXT_PAGE)
            //else pages.push(DISABLED_NEXT_PAGE)
            if (hasPrevious) pages.unshift(PREV_PAGE)
            //else pages.unshift(DISABLED_PREV_PAGE)

            //pages.push(PAD_RIGHT)
            //pages.unshift(PAD_LEFT)

            return pages
        }

        let pages = range(1, totalPages);

        // pages.push(PAD_RIGHT)
        // pages.unshift(PAD_LEFT)


        return pages

    }


    if (!props.totalRecords || getTotalPages() === 1) return null;

    const { currentPage } = state;
    const pages = fetchPageNumbers();

    const from = ((currentPage - 1) * props.pageLimit)+1;
    const toPage = currentPage * props.pageLimit ;

    return (

        <Card className={[props.className, "bg-white px-4 py-3 flex items-center justify-between sm:px-6"].join(' ')}>
            <div className="flex-1 flex justify-between sm:hidden">
                <a href="#" onClick={handlePrev} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500">
                    Previous
                    </a>
                <a href="#" onClick={handleNext} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500">
                    Next
                    </a>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">

                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{from}</span> to <span className="font-medium">{toPage}</span> of <span className="font-medium">{props.totalRecords}</span> results
                    </p>
                    </div>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">

                        {pages.map((page, index) => {

                            if (page === LEFT_PAGE) return (
                                <a key={index} href="#" onClick={handleMoveLeft} className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span className="sr-only">Previous</span>
                                    <span aria-hidden="true">...</span>
                                </a>
                            );

                            if (page === RIGHT_PAGE) return (

                                <a key={index} href="#" onClick={handleMoveRight} className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span className="sr-only">Next</span>
                                    <span aria-hidden="true">...</span>
                                </a>
                            );

                            if (page === NEXT_PAGE) return (
                                <a key={index} href="#" onClick={handleNext} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span className="sr-only">Next</span>

                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            );

                            if (page === PREV_PAGE) return (
                                <a key={index} href="#" onClick={handlePrev} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span className="sr-only">Previous</span>

                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            );

                            return (
                                <a href="#" key={index} onClick={currentPage === page ? (() => { }) : handleClick(page)} className={[currentPage === page ? 'bg-gray-300 cursor-default' : 'bg-white hover:bg-gray-50', "relative inline-flex items-center  px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700"].join(' ')}>
                                    {page}
                                </a>
                            );

                        })}
                    </nav>
                </div>
            </div>

        </Card>
    );


}

Pagination.propTypes = {
    totalRecords: PropTypes.number.isRequired,
    pageLimit: PropTypes.number,
    pageNeighbours: PropTypes.number,
    onPageChanged: PropTypes.func
};

export default Pagination;
