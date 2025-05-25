import React, { useEffect, useState } from 'react';
import { useLeague, Zone } from '../../contexts/LeagueContext';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ZoneFormData {
  name: string;
  leagueId: string;
  categoryId: string;
  isEditable: boolean;
}

const ZonesPage: React.FC = () => {
  const {
    leagues,
    getCategoriesByLeague,
    getZonesByCategory,
    addZone,
    updateZone,
    deleteZone,
  } = useLeague();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ZoneFormData>({
    defaultValues: {
      leagueId: '',
      categoryId: '',
      name: '',
      isEditable: true,
    },
  });

  const watchLeagueId = watch('leagueId');
  const watchCategoryId = watch('categoryId');

  useEffect(() => {
    if (!isAdding && !editingId) {
      setValue('leagueId', selectedLeague);
      setValue('categoryId', selectedCategory);
    }
  }, [selectedLeague, selectedCategory, setValue, isAdding, editingId]);

  const handleAddClick = () => {
    setIsAdding(true);
    setEditingId(null);
    reset({
      leagueId: selectedLeague,
      categoryId: selectedCategory,
      name: '',
      isEditable: true,
    });
  };

  const handleEditClick = (zone: Zone) => {
    setIsAdding(false);
    setEditingId(zone.id);
    reset({
      name: zone.name,
      leagueId: zone.leagueId,
      categoryId: zone.categoryId,
      isEditable: true,
    });
  };

  const handleCancelClick = () => {
    setIsAdding(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = (data: ZoneFormData) => {
    if (isAdding) {
      addZone(data);
    } else if (editingId) {
      updateZone(editingId, data);
    }
    setIsAdding(false);
    setEditingId(null);
    reset();
  };

  const handleDeleteZone = (id: string) => {
    if (
      window.confirm(
        '¿Estás seguro de eliminar esta zona? Esta acción eliminará todos los equipos y fixtures asociados.'
      )
    ) {
      deleteZone(id);
    }
  };

  const categories = getCategoriesByLeague(watchLeagueId || selectedLeague);
  const zones = watchCategoryId ? getZonesByCategory(watchCategoryId) : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Zonas</h1>
        <button
          className="btn btn-primary flex items-center space-x-2"
          onClick={handleAddClick}
          disabled={isAdding || !!editingId || !selectedCategory}
        >
          <Plus size={18} />
          <span>Agregar Zona</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="form-label" htmlFor="leagueFilter">
            Liga
          </label>
          <select
            id="leagueFilter"
            className="form-input"
            value={selectedLeague}
            onChange={(e) => {
              const leagueId = e.target.value;
              setSelectedLeague(leagueId);
              setSelectedCategory('');
            }}
            disabled={isAdding || !!editingId}
          >
            <option value="">Seleccionar Liga</option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label" htmlFor="categoryFilter">
            Categoría
          </label>
          <select
            id="categoryFilter"
            className="form-input"
            value={selectedCategory}
            onChange={(e) => {
              const categoryId = e.target.value;
              setSelectedCategory(categoryId);
            }}
            disabled={isAdding || !!editingId || !selectedLeague}
          >
            <option value="">Seleccionar Categoría</option>
            {getCategoriesByLeague(selectedLeague).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 border">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="form-label" htmlFor="name">
                  Nombre de la Zona
                </label>
                <input
                  id="name"
                  className={cn('form-input', errors.name && 'border-red-500')}
                  {...register('name', { required: 'El nombre es requerido' })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="form-label" htmlFor="leagueId">
                  Liga
                </label>
                <select
                  id="leagueId"
                  className={cn('form-input', errors.leagueId && 'border-red-500')}
                  {...register('leagueId', { required: 'La liga es requerida' })}
                  onChange={(e) => setValue('leagueId', e.target.value)}
                >
                  <option value="">Seleccionar Liga</option>
                  {leagues.map((league) => (
                    <option key={league.id} value={league.id}>
                      {league.name}
                    </option>
                  ))}
                </select>
                {errors.leagueId && (
                  <p className="text-sm text-red-500">{errors.leagueId.message}</p>
                )}
              </div>

              <div>
                <label className="form-label" htmlFor="categoryId">
                  Categoría
                </label>
                <select
                  id="categoryId"
                  className={cn('form-input', errors.categoryId && 'border-red-500')}
                  {...register('categoryId', { required: 'La categoría es requerida' })}
                  onChange={(e) => setValue('categoryId', e.target.value)}
                >
                  <option value="">Seleccionar Categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-sm text-red-500">{errors.categoryId.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="btn btn-outline flex items-center space-x-2"
                onClick={handleCancelClick}
              >
                <X size={18} />
                <span>Cancelar</span>
              </button>
              <button
                type="submit"
                className="btn btn-primary flex items-center space-x-2"
              >
                <Save size={18} />
                <span>{isAdding ? 'Crear Zona' : 'Guardar Cambios'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedCategory ? (
        zones.length > 0 ? (
          <div className="bg-white border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {zones.map((zone) => (
                  <tr key={zone.id}>
                    <td className="px-6 py-4">{zone.name}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => handleEditClick(zone)}
                        disabled={isAdding || !!editingId}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteZone(zone.id)}
                        disabled={isAdding || !!editingId}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-12 text-gray-500">
            No hay zonas. Agregá una para comenzar.
          </p>
        )
      ) : (
        <p className="text-center py-12 text-gray-500">
          Seleccioná una liga y categoría para ver las zonas.
        </p>
      )}
    </div>
  );
};

export default ZonesPage;
