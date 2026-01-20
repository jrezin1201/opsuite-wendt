"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioButton } from "@/components/ui/RadioButton";
import { SearchBar } from "@/components/ui/SearchBar";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { FileUpload } from "@/components/ui/FileUpload";
import { Modal } from "@/components/ui/Modal";
import { Tooltip } from "@/components/ui/Tooltip";
import { Accordion } from "@/components/ui/Accordion";
import { Tabs } from "@/components/ui/Tabs";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/SkeletonLoader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Carousel } from "@/components/ui/Carousel";
import { DatePicker } from "@/components/ui/DatePicker";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LazyImage } from "@/components/ui/LazyImage";
import { motion } from "framer-motion";

export function ComponentShowcase() {
  const [showModal, setShowModal] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState("option1");
  const [rangeValue, setRangeValue] = useState(50);
  const [searchValue, setSearchValue] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const tabs = [
    { label: "Inputs & Forms", content: <div /> },
    { label: "Feedback & Display", content: <div /> },
    { label: "Navigation", content: <div /> },
    { label: "Animations", content: <div /> },
  ];

  const carouselImages = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800&h=400&fit=crop",
  ];

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="mb-8">
        <Tabs
          items={tabs}
          defaultTab={activeTabIndex}
          onChange={setActiveTabIndex}
          variant="underline"
        />
      </div>

      {/* Inputs & Forms Tab */}
      {activeTabIndex === 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Button */}
          <ScrollReveal animation="slide-up" delay={0}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Buttons</h3>
                <div className="space-y-3">
                  <Button size="sm">Small Button</Button>
                  <Button size="md">Medium Button</Button>
                  <Button size="lg">Large Button</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>
            </Card>
          </ScrollReveal>

          {/* Toggle Switch */}
          <ScrollReveal animation="slide-up" delay={0.1}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Toggle Switch</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <ToggleSwitch
                      enabled={toggleValue}
                      onChange={setToggleValue}
                      size="sm"
                    />
                    <span className="text-white/70 text-sm">Small</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ToggleSwitch
                      enabled={toggleValue}
                      onChange={setToggleValue}
                      size="md"
                    />
                    <span className="text-white/70 text-sm">Medium</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ToggleSwitch
                      enabled={toggleValue}
                      onChange={setToggleValue}
                      size="lg"
                    />
                    <span className="text-white/70 text-sm">Large</span>
                  </div>
                </div>
              </div>
            </Card>
          </ScrollReveal>

          {/* Input Fields */}
          <ScrollReveal animation="slide-up" delay={0.2}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Input Fields</h3>
                <div className="space-y-3">
                  <Input placeholder="Basic input" />
                  <Input
                    placeholder="With icon"
                    leftIcon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    }
                  />
                  <Input
                    placeholder="Error state"
                    error="This field is required"
                  />
                </div>
              </div>
            </Card>
          </ScrollReveal>

          {/* Textarea */}
          <ScrollReveal animation="slide-up" delay={0.3}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Textarea</h3>
                <Textarea
                  placeholder="Enter your message..."
                  rows={4}
                  showCharCount
                  maxCharCount={200}
                />
              </div>
            </Card>
          </ScrollReveal>

          {/* Checkbox & Radio */}
          <ScrollReveal animation="slide-up" delay={0.4}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Checkbox & Radio</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={checkboxValue}
                      onChange={(e) => setCheckboxValue(e.target.checked)}
                    />
                    <span className="text-white/70">Checkbox option</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <RadioButton
                        name="demo"
                        value="option1"
                        checked={radioValue === "option1"}
                        onChange={(e) => setRadioValue(e.target.value)}
                      />
                      <span className="text-white/70">Radio Option 1</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioButton
                        name="demo"
                        value="option2"
                        checked={radioValue === "option2"}
                        onChange={(e) => setRadioValue(e.target.value)}
                      />
                      <span className="text-white/70">Radio Option 2</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </ScrollReveal>

          {/* Search Bar */}
          <ScrollReveal animation="slide-up" delay={0.5}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Search Bar</h3>
                <SearchBar
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Search components..."
                  suggestions={["Button", "Input", "Card", "Modal", "Tooltip"]}
                />
              </div>
            </Card>
          </ScrollReveal>

          {/* Range Slider */}
          <ScrollReveal animation="slide-up" delay={0.6}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Range Slider</h3>
                <RangeSlider
                  min={0}
                  max={100}
                  value={rangeValue}
                  onChange={setRangeValue}
                  formatValue={(val) => `${val}%`}
                />
              </div>
            </Card>
          </ScrollReveal>

          {/* File Upload */}
          <ScrollReveal animation="slide-up" delay={0.7}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">File Upload</h3>
                <FileUpload
                  onFilesSelected={(files) => console.log("Files:", files)}
                  maxSize={5 * 1024 * 1024}
                  maxFiles={3}
                />
              </div>
            </Card>
          </ScrollReveal>

          {/* Date Picker */}
          <ScrollReveal animation="slide-up" delay={0.8}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Date Picker</h3>
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  minDate={new Date()}
                  placeholder="Select a date..."
                />
                {selectedDate && (
                  <p className="text-white/70 text-sm mt-3">
                    Selected: {selectedDate.toLocaleDateString()}
                  </p>
                )}
              </div>
            </Card>
          </ScrollReveal>

          {/* Carousel */}
          <ScrollReveal animation="slide-up" delay={0.9}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Carousel</h3>
                <Carousel
                  items={carouselImages.map((src, index) => (
                    <div key={index} className="h-48 w-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                      <p className="text-white text-2xl font-bold">Slide {index + 1}</p>
                    </div>
                  ))}
                  autoPlay
                  interval={3000}
                />
              </div>
            </Card>
          </ScrollReveal>
        </div>
      )}

      {/* Feedback & Display Tab */}
      {activeTabIndex === 1 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Modal */}
          <ScrollReveal animation="slide-up" delay={0}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Modal</h3>
                <Button onClick={() => setShowModal(true)}>Open Modal</Button>
                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Modal Title</h3>
                    <p className="text-white/70 mb-6">
                      This is a modal dialog. Press ESC or click outside to close.
                    </p>
                    <Button onClick={() => setShowModal(false)}>Close</Button>
                  </div>
                </Modal>
              </div>
            </Card>
          </ScrollReveal>

          {/* Tooltip */}
          <ScrollReveal animation="slide-up" delay={0.1}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Tooltip</h3>
                <div className="flex gap-4 flex-wrap">
                  <Tooltip content="Top tooltip" side="top">
                    <Button size="sm">Top</Button>
                  </Tooltip>
                  <Tooltip content="Bottom tooltip" side="bottom">
                    <Button size="sm">Bottom</Button>
                  </Tooltip>
                  <Tooltip content="Left tooltip" side="left">
                    <Button size="sm">Left</Button>
                  </Tooltip>
                  <Tooltip content="Right tooltip" side="right">
                    <Button size="sm">Right</Button>
                  </Tooltip>
                </div>
              </div>
            </Card>
          </ScrollReveal>

          {/* Accordion */}
          <ScrollReveal animation="slide-up" delay={0.2}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Accordion</h3>
                <Accordion
                  items={[
                    { title: "What is this?", content: "An accordion component with smooth animations." },
                    { title: "How does it work?", content: "Click to expand and collapse sections." },
                    { title: "Can I customize it?", content: "Yes! It's fully customizable." },
                  ]}
                />
              </div>
            </Card>
          </ScrollReveal>

          {/* Progress Bar */}
          <ScrollReveal animation="slide-up" delay={0.3}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Progress Bar</h3>
                <div className="space-y-4">
                  <ProgressBar value={75} color="purple" animated />
                  <ProgressBar value={50} color="blue" />
                  <ProgressBar value={90} color="green" />
                </div>
              </div>
            </Card>
          </ScrollReveal>

          {/* Badges */}
          <ScrollReveal animation="slide-up" delay={0.4}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge dot>With Dot</Badge>
                  <Badge pulse>Pulse</Badge>
                  <Badge pill>Pill Shape</Badge>
                </div>
              </div>
            </Card>
          </ScrollReveal>

          {/* Skeleton Loader */}
          <ScrollReveal animation="slide-up" delay={0.5}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Skeleton Loaders</h3>
                <div className="space-y-4">
                  <Skeleton width="100%" height="20px" />
                  <Skeleton width="80%" height="20px" />
                  <Skeleton width="60%" height="20px" />
                </div>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      )}

      {/* Navigation Tab */}
      {activeTabIndex === 2 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pagination */}
          <ScrollReveal animation="slide-up" delay={0}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Pagination</h3>
                <Pagination
                  currentPage={currentPage}
                  totalPages={10}
                  onPageChange={setCurrentPage}
                />
                <p className="text-white/70 text-sm mt-3">Page {currentPage} of 10</p>
              </div>
            </Card>
          </ScrollReveal>

          {/* Breadcrumbs */}
          <ScrollReveal animation="slide-up" delay={0.1}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Breadcrumbs</h3>
                <Breadcrumbs
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Components", href: "/components" },
                    { label: "Navigation", href: "/components/navigation" },
                  ]}
                />
              </div>
            </Card>
          </ScrollReveal>

          {/* Lazy Loading Image */}
          <ScrollReveal animation="slide-up" delay={0.2}>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Lazy Loading</h3>
                <LazyImage
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop"
                  alt="Lazy loaded image"
                  className="rounded-lg w-full h-48 object-cover"
                />
                <p className="text-white/70 text-sm mt-3">Image loads when scrolled into view</p>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      )}

      {/* Animations Tab */}
      {activeTabIndex === 3 && (
        <div key={`animations-tab-${activeTabIndex}`} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0 }}
            whileHover={{ scale: 1.05, opacity: 0.8 }}
          >
            <Card>
              <div className="p-6 cursor-pointer">
                <h3 className="text-lg font-semibold text-white mb-2">Fade & Scale</h3>
                <p className="text-white/70 text-sm">Hover to see fade and scale effect</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -10 }}
          >
            <Card>
              <div className="p-6 cursor-pointer">
                <h3 className="text-lg font-semibold text-white mb-2">Slide Up</h3>
                <p className="text-white/70 text-sm">Hover to slide up</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: 10 }}
          >
            <Card>
              <div className="p-6 cursor-pointer">
                <h3 className="text-lg font-semibold text-white mb-2">Slide Down</h3>
                <p className="text-white/70 text-sm">Hover to slide down</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ x: -10 }}
          >
            <Card>
              <div className="p-6 cursor-pointer">
                <h3 className="text-lg font-semibold text-white mb-2">Slide Left</h3>
                <p className="text-white/70 text-sm">Hover to slide left</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ x: 10 }}
          >
            <Card>
              <div className="p-6 cursor-pointer">
                <h3 className="text-lg font-semibold text-white mb-2">Slide Right</h3>
                <p className="text-white/70 text-sm">Hover to slide right</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.15 }}
          >
            <Card>
              <div className="p-6 cursor-pointer">
                <h3 className="text-lg font-semibold text-white mb-2">Zoom Animation</h3>
                <p className="text-white/70 text-sm">Hover to zoom in</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ rotateY: 180 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <Card>
              <div className="p-6 cursor-pointer" style={{ backfaceVisibility: "hidden" }}>
                <h3 className="text-lg font-semibold text-white mb-2">Flip Animation</h3>
                <p className="text-white/70 text-sm">Hover to flip</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Card glow="purple">
              <div className="p-6 cursor-pointer">
                <h3 className="text-lg font-semibold text-white mb-2">Rotate & Glow</h3>
                <p className="text-white/70 text-sm">Hover to rotate with purple glow</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <Card glow="pink">
              <div className="p-6 cursor-pointer">
                <h3 className="text-lg font-semibold text-white mb-2">Rotate & Pink Glow</h3>
                <p className="text-white/70 text-sm">Hover to rotate with pink glow</p>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
