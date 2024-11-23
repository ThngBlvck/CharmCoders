<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    // Mối quan hệ với AttributeValue: 1 Attribute có thể có nhiều AttributeValue
    public function variants()
    {
        return $this->belongsToMany(
            Variant::class,
            'variant_attribute_values',
            'attribute_value_id',
            'variant_id'
        );
    }

    // Mối quan hệ với VariantAttributeValue
    public function variantAttributeValues()
    {
        return $this->hasMany(VariantAttributeValue::class);
    }
    public function values()
    {
        return $this->hasMany(AttributeValue::class, 'attribute_id', 'id');
    }
}


