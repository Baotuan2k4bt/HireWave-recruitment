import { Drawer } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconFilter } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import SearchBanner from "../Components/FindJobs/SearchBanner";
import FiltersSidebar from "../Components/FindJobs/FiltersSidebar";
import Jobs from "../Components/FindJobs/Jobs";

const FindJobsPage = () => {
    const matches = useMediaQuery('(max-width: 1024px)');
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner & Search Bar */}
            <SearchBanner />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Mobile Filter Button */}
                    {matches && (
                        <div className="flex justify-end">
                            <Button
                                onClick={open}
                                leftSection={<IconFilter size={18} />}
                                variant="outline"
                                className="border-blue-500 text-blue-600 hover:bg-blue-50"
                            >
                                Bộ lọc
                            </Button>
                        </div>
                    )}

                    {/* Filters Sidebar - Desktop */}
                    {!matches && <FiltersSidebar />}

                    {/* Filters Drawer - Mobile */}
                    <Drawer
                        opened={opened}
                        onClose={close}
                        title="Bộ lọc"
                        position="right"
                        size="md"
                        padding="md"
                    >
                        <FiltersSidebar />
                    </Drawer>

                    {/* Jobs List */}
                    <div className="flex-1 min-w-0">
                        <Jobs />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FindJobsPage;