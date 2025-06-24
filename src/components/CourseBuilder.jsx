import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCourses } from '../context/CoursesContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiPlus, FiUpload, FiVideo, FiFile, FiDollarSign, FiSave, FiEye } = FiIcons;

const CourseBuilder = ({ onClose, editingCourse = null }) => {
  const { addCourse, updateCourse } = useCourses();
  const [step, setStep] = useState(1);
  const [courseData, setCourseData] = useState(editingCourse || {
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner',
    price: 0,
    thumbnail: '',
    lessons: [],
    requirements: [''],
    learningOutcomes: [''],
    tags: []
  });

  const categories = [
    'Baking & Pastry',
    'Cooking Techniques',
    'International Cuisine',
    'Knife Skills',
    'Molecular Gastronomy',
    'Food Safety',
    'Restaurant Management',
    'Wine & Beverage'
  ];

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner', color: 'text-green-600' },
    { value: 'intermediate', label: 'Intermediate', color: 'text-yellow-600' },
    { value: 'advanced', label: 'Advanced', color: 'text-red-600' }
  ];

  const handleAddLesson = () => {
    setCourseData({
      ...courseData,
      lessons: [...courseData.lessons, {
        id: Date.now(),
        title: '',
        description: '',
        type: 'video',
        duration: '',
        content: '',
        resources: []
      }]
    });
  };

  const handleUpdateLesson = (lessonId, updates) => {
    setCourseData({
      ...courseData,
      lessons: courseData.lessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, ...updates } : lesson
      )
    });
  };

  const handleRemoveLesson = (lessonId) => {
    setCourseData({
      ...courseData,
      lessons: courseData.lessons.filter(lesson => lesson.id !== lessonId)
    });
  };

  const handleSaveCourse = () => {
    const course = {
      ...courseData,
      id: editingCourse?.id || Date.now(),
      status: 'draft',
      enrolled: editingCourse?.enrolled || 0,
      createdAt: editingCourse?.createdAt || new Date().toISOString()
    };

    if (editingCourse) {
      updateCourse(course);
    } else {
      addCourse(course);
    }

    onClose();
  };

  const handlePublishCourse = () => {
    const course = {
      ...courseData,
      id: editingCourse?.id || Date.now(),
      status: 'published',
      enrolled: editingCourse?.enrolled || 0,
      createdAt: editingCourse?.createdAt || new Date().toISOString(),
      publishedAt: new Date().toISOString()
    };

    if (editingCourse) {
      updateCourse(course);
    } else {
      addCourse(course);
    }

    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </h2>
              <p className="text-gray-600">Step {step} of 3</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <SafeIcon icon={FiX} className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={courseData.title}
                    onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Advanced Pastry Techniques"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={courseData.description}
                    onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Describe what students will learn in this course..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={courseData.category}
                      onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level *
                    </label>
                    <select
                      value={courseData.difficulty}
                      onChange={(e) => setCourseData({ ...courseData, difficulty: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {difficultyLevels.map((level) => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (USD) *
                    </label>
                    <div className="relative">
                      <SafeIcon icon={FiDollarSign} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={courseData.price}
                        onChange={(e) => setCourseData({ ...courseData, price: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Thumbnail
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                      <SafeIcon icon={FiUpload} className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload thumbnail</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Course Content */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Course Lessons</h3>
                  <button
                    onClick={handleAddLesson}
                    className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <SafeIcon icon={FiPlus} className="h-4 w-4" />
                    <span>Add Lesson</span>
                  </button>
                </div>

                {courseData.lessons.length > 0 ? (
                  <div className="space-y-4">
                    {courseData.lessons.map((lesson, index) => (
                      <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Lesson {index + 1}</h4>
                          <button
                            onClick={() => handleRemoveLesson(lesson.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <SafeIcon icon={FiX} className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) => handleUpdateLesson(lesson.id, { title: e.target.value })}
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Lesson title"
                          />
                          <select
                            value={lesson.type}
                            onChange={(e) => handleUpdateLesson(lesson.id, { type: e.target.value })}
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="video">Video</option>
                            <option value="text">Text</option>
                            <option value="quiz">Quiz</option>
                            <option value="assignment">Assignment</option>
                          </select>
                        </div>

                        <textarea
                          value={lesson.description}
                          onChange={(e) => handleUpdateLesson(lesson.id, { description: e.target.value })}
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
                          placeholder="Lesson description"
                        />

                        {lesson.type === 'video' && (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <SafeIcon icon={FiVideo} className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Upload video or paste video URL</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <SafeIcon icon={FiFile} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No lessons added yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Requirements & Outcomes */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Requirements
                  </label>
                  {courseData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => {
                          const newReqs = [...courseData.requirements];
                          newReqs[index] = e.target.value;
                          setCourseData({ ...courseData, requirements: newReqs });
                        }}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., Basic knife skills required"
                      />
                      {courseData.requirements.length > 1 && (
                        <button
                          onClick={() => {
                            const newReqs = courseData.requirements.filter((_, i) => i !== index);
                            setCourseData({ ...courseData, requirements: newReqs });
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <SafeIcon icon={FiX} className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setCourseData({
                      ...courseData,
                      requirements: [...courseData.requirements, '']
                    })}
                    className="text-orange-600 hover:text-orange-700 text-sm"
                  >
                    + Add requirement
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Outcomes
                  </label>
                  {courseData.learningOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={outcome}
                        onChange={(e) => {
                          const newOutcomes = [...courseData.learningOutcomes];
                          newOutcomes[index] = e.target.value;
                          setCourseData({ ...courseData, learningOutcomes: newOutcomes });
                        }}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., Master advanced pastry techniques"
                      />
                      {courseData.learningOutcomes.length > 1 && (
                        <button
                          onClick={() => {
                            const newOutcomes = courseData.learningOutcomes.filter((_, i) => i !== index);
                            setCourseData({ ...courseData, learningOutcomes: newOutcomes });
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <SafeIcon icon={FiX} className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setCourseData({
                      ...courseData,
                      learningOutcomes: [...courseData.learningOutcomes, '']
                    })}
                    className="text-orange-600 hover:text-orange-700 text-sm"
                  >
                    + Add learning outcome
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <div className="flex space-x-3">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSaveCourse}
                className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SafeIcon icon={FiSave} className="h-4 w-4" />
                <span>Save Draft</span>
              </button>

              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handlePublishCourse}
                  className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <SafeIcon icon={FiEye} className="h-4 w-4" />
                  <span>Publish Course</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CourseBuilder;